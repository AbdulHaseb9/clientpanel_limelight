import { Link } from "react-router-dom";
import confrmOrder from "/assets/order_confirm.jpg";

export const Greeting = () => {
  return (
    <section className="w-full flex flex-col items-center justify-center">
      <img
        src={confrmOrder}
        alt="Order Confirm Image"
        className="w-72 lg:w-80 mix-blend-multiply"
      />
      <h1 className="text-xl md:text-2xl font-semibold tracking-widest">
        Your Order is Confirmed
      </h1>
      <p className="text-sm md:text-lg mt-2 text-center text-gray-600">
        Thank you for choosing LimeLight Digitizing. Your order has been
        received and will be processed shortly.
      </p>
      <Link
        to="/clientpanel"
        className="mt-4 px-8 py-2 text-sm font-medium text-white bg-lime-500 rounded-md hover:bg-lime-600"
      >
        Back to Orders
      </Link>
    </section>
  );
};
