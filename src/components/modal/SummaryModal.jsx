import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
} from "@nextui-org/react";
import MyLoader from "../skeletons/MyLoader";
import MyHeaderSkeleton from "../skeletons/MyHeaderSkeleton";
import { HashLoader } from "react-spinners";
import { IoCloseSharp } from "react-icons/io5";

export default function SummaryModal({
  isOpen,
  onClose,
  walletAddress,
  walletData=null,
}) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    console.log("Modal data: ", walletData);
  }, [walletAddress]);
  return (
    <>
      <Modal
        size="full"
        isOpen={isOpen}
        onClose={onClose}
        className="text-black"
        scrollBehavior="inside"
        closeButton={
          <div className="text-black">
            <IoCloseSharp size={24} />
          </div>
        }
      >
        <ModalContent>
          {(onClose) =>
              <>
                <ModalHeader className={` flex ${walletData ? "flex-col" : "flex-row"} gap-2`}>
                  {walletAddress}
                  <div className={`${isLoading ? "flex" : "hidden"}`}><MyHeaderSkeleton /></div>
                  <Tooltip content="Loading..." className="text-black">
                  <div className={`absolute top-10 right-20 ${isLoading ? "flex" : "hidden"} justify-center items-center p-2 rounded-md border-2 border-black`}>
                  <HashLoader size={15} /></div></Tooltip>
                </ModalHeader>
                <ModalBody className="flex flex-col justify-around items-center">
                  <div className="">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam pulvinar risus non risus hendrerit venenatis.
                      Pellentesque sit amet hendrerit risus, sed porttitor quam.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam pulvinar risus non risus hendrerit venenatis.
                      Pellentesque sit amet hendrerit risus, sed porttitor quam.
                    </p>
                    <p>
                      Magna exercitation reprehenderit magna aute tempor
                      cupidatat consequat elit dolor adipisicing. Mollit dolor
                      eiusmod sunt ex incididunt cillum quis. Velit duis sit
                      officia eiusmod Lorem aliqua enim laboris do dolor
                      eiusmod.
                    </p>
                  </div>
                  <div className="w-full md:flex justify-center items-center hidden ">
                    <MyLoader />
                  </div>
                </ModalBody>
              </>
          }
        </ModalContent>
      </Modal>
    </>
  );
}
