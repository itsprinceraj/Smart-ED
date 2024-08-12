import toast from "react-hot-toast";
import { paymentApiEndpoints } from "../apiEndPoints";
import { apiConnector } from "../apiConnector";
import { setPaymentLoading } from "../../redux/slices/courseSlice";
import { resetCartItems } from "../../redux/slices/cartSlice";
import rzpLogo from "../../assets/Logo/logo.webp";

const { COURSE_PAYMENT_API, VERIFY_SIGNATURE_API, PAYMENT_SUCCESS_EMAIL_API } =
  paymentApiEndpoints;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export const buyCourse = async (
  token,
  courses,
  userDetails,
  navigate,
  dispatch
) => {
  // const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;
  const toastId = toast.loading("Loading...");
  try {
    //load the script
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("RazorPay SDK failed to load");
      return;
    }

    // console.log(COURSE_PAYMENT_API);
    //initiate the order
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses: courses },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!orderResponse?.success) {
      throw new Error(orderResponse?.message);
    }
    console.log("PRINTING orderResponse", orderResponse);
    //options
    const options = {
      key: "rzp_test_VV2AAQlbU3YLsA",
      currency: orderResponse.data.currency,
      amount: `${orderResponse.data.amount}`,
      order_id: orderResponse.data.id,
      name: "SMART-ED",
      description: "Thank You for Purchasing the Course",
      image: rzpLogo,
      prefill: {
        name: `${userDetails.firstName}`,
        email: userDetails.email,
      },
      handler: function (response) {
        //send successful wala mail
        sendPaymentSuccessEmail(response, orderResponse.data.amount, token);
        //verifyPayment
        verifyPayment({ ...response, courses }, token, navigate, dispatch);
      },
    };
    // console.log("payment object ke uper ");
    //miss hogya tha
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      toast.error("oops, payment failed");
      console.log(response.error);
    });
  } catch (error) {
    console.log("PAYMENT API ERROR.....", error);
    toast.error("Could not make Payment");
  }
  toast.dismiss(toastId);
};

//verify payment
export const verifyPayment = async (bodyData, token, navigate, dispatch) => {
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

    if (!response.success) {
      throw new Error(response.message);
    }
    toast.success("payment Successful, you are addded to the course");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCartItems());
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR....", error);
    toast.error("Could not verify Payment");
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
};

//  send Payment email
export const sendPaymentSuccessEmail = async (response, amount, token) => {
  try {
    await apiConnector(
      "POST",
      PAYMENT_SUCCESS_EMAIL_API,
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
