import { paymentApiEndpoints } from "../apiEndPoints";
import { toast } from "react-hot-toast";
import { apiConnector, apiconnector } from "../apiConnector";
import { setPaymentLoading } from "../../redux/slices/courseSlice";
import { resetCart } from "../../redux/slices/cartSlice";
import rzpLogo from "../../assets/Logo/terminal.png";
const { CAPTURE_PAYMENT_API, VERIFY_SIGNATURE_API, PAYMENT_SUCCESS_API } =
  paymentApiEndpoints;

//  for payment integration load a sdk script
const loadScript = (src) => {
  return new Promise((resolve) => {
    // create a element script
    const script = document.createElement("script");

    //  put src of that script into arguments src
    script.src = src;

    // mark resolve
    script.onload = () => {
      resolve(true);
    };

    //  if error reject it
    script.onerror = () => {
      resolve(false);
    };

    document.appendChild(script);
  });
};

//  create a function for buying course
export const buyCourse = async (
  courses,
  token,
  userDetails,
  dispatch,
  navigate
) => {
  const toastId = toast.loading("Loading...");
  try {
    // load script
    const response = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!response) {
      throw new Error(response.data.message);
    }

    //  make an api call to initiat order
    const orderRes = await apiconnector(
      "POST",
      CAPTURE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log(orderRes);
    if (!orderRes.success) {
      return toast.error(orderRes.message);
    }

    // now create options
    const options = {
      key: process.env.RAZORPAY_KEY,
      currency: orderRes.data.message.currency,
      amount: `${orderRes.data.message.amount}`,
      order_id: orderRes.data.message.id,
      name: "Smart-ED",
      description: "Thank You for Purchasing the Course",
      image: rzpLogo,
      prefill: {
        name: `${userDetails.firstName}`,
        email: userDetails.email,
      },
      handler: function (response) {
        //send successful wala mail
        sendPaymentSuccessEmail(response, orderRes.data.message.amount, token);
        //verifyPayment
        verifyPayment({ ...response, courses }, token, navigate, dispatch);
      },
    };

    //  create a payment object
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      toast.error("oops, payment failed");
      console.log(response.error);
    });
  } catch (error) {
    console.log("Payment api error:", error);
    toast.error("unable to buy course");
  }
  toast.dismiss(toastId);
};

//  sendPayment successfull function
const sendPaymentSuccessEmail = async (response, amount, token) => {
  try {
    await apiConnector(
      "POST",
      PAYMENT_SUCCESS_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
  }
};

//verify payment function
const verifyPayment = async (bodyData, token, navigate, dispatch) => {
  const toastId = toast.loading("Verifying Payment....");
  dispatch(setPaymentLoading(true));
  try {
    const response = await apiConnector(
      "POST",
      VERIFY_SIGNATURE_API,
      bodyData,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("payment Successful, ypou are addded to the course");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR....", error);
    toast.error("Could not verify Payment");
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
};
