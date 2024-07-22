import React from "react";
import { ContactUsForm } from "../contactUsPage/ContactUsForm";

export const ContactFormSection = () => {
  return (
    <div>
      <h1 className="text-center text-4xl font-semibold">Get In Touch</h1>
      <p className="text-center text-richblack-300 mt-3">
        We&apos;d love to here for you, Please fill out this form.
      </p>

      {/*  contact us form  */}
      <div className=" lg:w-[48%] m-auto mt-8">
        <ContactUsForm />
      </div>
    </div>
  );
};
