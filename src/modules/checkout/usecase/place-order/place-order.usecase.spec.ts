import Id from "../../../@shared/domain/value-object/id.value-object";
import { Product } from "../../domain/product.entity";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUsecase from "./place-order.usecase";

const mockDate = new Date(2000, 1, 1);

describe("Place Order Usecase unit test", () => {

  describe("validate products methods", () => {
    const mockClientFacade = {
      find: jest.fn().mockResolvedValue(true),
    };
    //@ts-expect-error - no params in constructor
    const placerOrderUseCase = new PlaceOrderUsecase();

    it("should throw error if no products are selected", async () => {
      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(placerOrderUseCase["validateProducts"](input)).rejects.toThrow(
        new Error("No products selected")
      );
    });

    it("should throw error when product is out of stock", async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) =>
          Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1
          })
        ),
      }

      //@ts-expect-error - force set productFacade
      placerOrderUseCase["_productFacade"] = mockProductFacade;

      let input: PlaceOrderInputDto = {
        clientId: "0",
        products: [{ productId: "1" }],
      };

      await expect(
        placerOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      await expect(placerOrderUseCase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
      };

      await expect(placerOrderUseCase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);

    });

  });

  describe("getProducts method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    //@ts-expect-error - no params in constructor
    const placerOrderUseCase = new PlaceOrderUsecase();

    it("should throw an error when product not found", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      //@ts-expect-error - force set catalogFacade
      placerOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placerOrderUseCase["getProduct"]("0")).rejects.toThrow(
        new Error("Product not found")
      );
    });

    it("should return a product", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: "0",
          name: "product 0",
          description: "product 0",
          salesPrice: 1
        }),
      };

      //@ts-expect-error - force set catalogFacade
      placerOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placerOrderUseCase["getProduct"]("0")).resolves.toEqual(
        new Product({
          id: new Id("0"),
          name: "product 0",
          description: "product 0",
          salesPrice: 1
        })
      );

      expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
    });

  });

  describe("execute method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should throw error when client not foud", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      //@ts-expect-error - no params in constructor
      const placerOrderUseCase = new PlaceOrderUsecase();

      //@ts-expect-error - force set clientFacade
      placerOrderUseCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(placerOrderUseCase.execute(input)).rejects.toThrow(
        new Error("Client not found")
      );
    });


    it("should throw error when products are not valid", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true),
      };

      //@ts-expect-error - no params in constructor
      const placerOrderUseCase = new PlaceOrderUsecase();

      const mockValidadeProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(placerOrderUseCase, "validateProducts")
        //@ts-expect-error - not return never
        .mockRejectedValue(new Error("No products selected"));

      //@ts-expect-error - force set clientFacade
      placerOrderUseCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(placerOrderUseCase.execute(input)).rejects.toThrow(
        new Error("No products selected")
      );
      expect(mockValidadeProducts).toHaveBeenCalledTimes(1);
    });

    describe("place an order", () => {
      const clientProps = {
        id: "1c",
        name: "Client 0",
        document: "0000",
        email: "client@user.com",
        address: {
          street: "some address",
          number: "1",
          complement: "",
          city: "some city",
          state: "some state",
          zipCode: "000",            
        }
      };

      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(clientProps),
      };

      const mockPaymentFacade = {
        process: jest.fn(),
      };

      const mockCheckoutRepository = {
        addOrder: jest.fn(),
      };

      const mockInvoiceFacade = {
        generate: jest.fn().mockResolvedValue({id: "1i"}),
      };

      const placerOrderUseCase = new PlaceOrderUsecase(
        mockClientFacade as any,
        null,
        null,
        mockCheckoutRepository as any,
        mockInvoiceFacade as any,
        mockPaymentFacade
      );

      const products = {
        "1": new Product({
          id: new Id("1"),
          name: "Product 1",
          description: "some description",
          salesPrice: 40,
        }),
        "2": new Product({
          id: new Id("2"),
          name: "Product 2",
          description: "some description",
          salesPrice: 30,
        }),
      };

      const mockValidateProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(placerOrderUseCase, "validateProducts")
        //@ts-expect-error - spy on private method
        .mockResolvedValue(null);

      const mockGetProduct = jest
        //@ts-expect-error - spy on private method
        .spyOn(placerOrderUseCase, "getProduct")
        //@ts-expect-error - not return never
        .mockImplementation((productId: keyof typeof products) => {
          return products[productId];
        });

      it ("should not be approved", async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: "1t",
          orderId: "1o",
          amount: 100,
          status: "error",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        const input: PlaceOrderInputDto = {
          clientId: "1c",
          products: [
            { productId: "1" },
            { productId: "2" },
          ],
        };

        let output = await placerOrderUseCase.execute(input);
        
        expect(output.invoiceId).toBeNull();
        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual([
          { productId: "1" },
          { productId: "2" },          
        ]);
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockValidateProducts).toHaveBeenCalledWith(input);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });
        expect(mockInvoiceFacade.generate).not.toHaveBeenCalled();
      });

      it ("should be approved", async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: "1t",
          orderId: "1o",
          amount: 100,
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const input: PlaceOrderInputDto = {
          clientId: "1c",
          products: [
            { productId: "1" },
            { productId: "2" },
          ],
        };

        let output = await placerOrderUseCase.execute(input);
        
        expect(output.invoiceId).toBe("1i");
        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual([
          { productId: "1" },
          { productId: "2" },          
        ]);
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total
        });
        expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
        expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
          name: clientProps.name,
          document: clientProps.document,
          street: clientProps.address.street,
          city: clientProps.address.city,
          complement: clientProps.address.complement,
          number: clientProps.address.number,
          state: clientProps.address.state,
          zipCode: clientProps.address.zipCode,
          items: [
            { id: products["1"].id.id, name: products["1"].name, price: products["1"].salesPrice },
            { id: products["2"].id.id, name: products["2"].name, price: products["2"].salesPrice },
          ],
        });

      });


    });
  });

});