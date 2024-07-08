import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import MyLoader from "../skeletons/MyLoader";
import { HashLoader } from "react-spinners";

export default function SummaryModal({
  isOpen,
  onClose,
  walletAddress,
  walletData=null,
}) {
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
      >
        <ModalContent>
          {(onClose) =>
            (!walletData) ? (
              <ModalContent className="flex justify-center items-center">
                <HashLoader />
              </ModalContent>
            ) : (
              <>
                <ModalHeader className="bg-red-400 flex flex-col gap-2">
                  {walletAddress}
                  <div className="">{JSON.stringify(walletData)}</div>
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
                <ModalFooter className="bg-green-400">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>
    </>
  );
}
