import React from "react";
import { useStore } from "@/hooks/useStore";
import Modal from "../modal";

import { Check } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { BASE_URL } from "@/lib/base-url";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "../spinner";
import { DURATION_TYPE, PRO_PLAN_BASIC } from "@/constants/pricing-plans-basic";

const ProModal = () => {
  const { isProModalOpen, onCloseProModal } = useStore();
  const [loading, setLoading] = React.useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/stripe`);
      console.log(response, "response:");
      if (response.data.url && typeof window !== "undefined") {
        window.location.href = response.data.url;
      } else {
        toast({
          title: "Error",
          description: "Stripe session URL not found",
          variant: "destructive",
        });
      }
    } catch  {
      toast({
        title: "Error",
        description: `
        An error occurred while processing
        your subscription. Please try again.
        `,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onCloseProModal();
  };
  return (
    <Modal
      title="Upgrade to Premium"
      subTitle="Enjoy an enhanced experience, 
      exclusive creator tools, top-tier verification 
      and security."
      isCentered
      isOpen={isProModalOpen}
      onClose={handleClose}
      body={
        <div className="w-full">
          <div
            className="flex flex-col gap-4  
          border-primary border-[#282829]
          shrink-0 max-w-[300px] mx-auto
          min-h-[328px] px-[30px] py-[25px]
          border rounded-2xl relative "
          >
            <div className="w-full">
              <h1
                className="text-2xl 
              font-semibold"
              >
                {PRO_PLAN_BASIC.typeName}
              </h1>
            </div>

            <div className="flex items-center">
              <h5 className="text-5xl font-semibold">
                ${PRO_PLAN_BASIC.price}
                <span className="!text-[16px]">
                  {PRO_PLAN_BASIC.duration === DURATION_TYPE.MONTHLY && "/month"}
                </span>
              </h5>
            </div>
            <p className="">{PRO_PLAN_BASIC.description}</p>
            <div>
              <p className="font-normal text-[14px] mb-1">
                {PRO_PLAN_BASIC.highlightFeature}
              </p>
              <ul
                className="font-normal flex mb-3 
              flex-col gap-2"
              >
                {PRO_PLAN_BASIC.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex gap-2 
                    items-center text-[15px]"
                  >
                    <Check size="20px" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="brandPrimary"
                size="brandsm"
                width="full"
                disabled={loading}
                onClick={onSubscribe}
              >
                {loading && <Spinner size="default" />}
                Subscribe & Pay
              </Button>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default ProModal;