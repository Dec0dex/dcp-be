import 'reflect-metadata';
import { Order, getOrder } from './order.decorator';

describe('Order Decorator', () => {
  class TestClass {
    @Order(1)
    firstProperty: string;

    @Order(2)
    secondProperty: string;

    noOrderProperty: string;
  }

  it('should retrieve the order value using getOrder', () => {
    const testInstance = new TestClass();

    const firstOrder = getOrder(testInstance, 'firstProperty');
    const secondOrder = getOrder(testInstance, 'secondProperty');

    expect(firstOrder).toBe(1);
    expect(secondOrder).toBe(2);
  });

  it('should return default value if no order metadata is found', () => {
    const testInstance = new TestClass();

    const defaultOrder = getOrder(testInstance, 'noOrderProperty');
    expect(defaultOrder).toBe(0);
  });

  it('should return default value if the target is not an object', () => {
    const order = getOrder(null, 'someProperty');
    expect(order).toBe(0);
  });

  it('should return the specified default value if no order metadata is found', () => {
    const testInstance = new TestClass();

    const customDefaultOrder = getOrder(testInstance, 'noOrderProperty', 5);
    expect(customDefaultOrder).toBe(5);
  });

  it('should return the specified default value if the target is not an object', () => {
    const customDefaultOrder = getOrder(null, 'someProperty', 10);
    expect(customDefaultOrder).toBe(10);
  });
});
