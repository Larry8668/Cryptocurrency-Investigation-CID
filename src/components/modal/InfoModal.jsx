import React from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { IoCloseSharp } from "react-icons/io5";

const steps = [
  {
    id: 1,
    text: "Get access to a Wallet ID you want to start exploring"
  },
  {
    id: 2,
    text: "Enter the Wallet ID in the search bar above"
  },
  {
    id: 3,
    text: "The wallets that have any transactions with the entered wallet will show up as a tree"
  },
  {
    id: 4,
    text: "To explore any other node, simply double click the required node"
  },
  {
    id: 5,
    text: "If any transactions exist, it will be summarized into the tree and will be shown"
  },
  {
    id: 6,
    text: "Click the node to find more info about the wallet"
  },
  {
    id:7,
    text: "Save the graph state to localStorage by clicking the save button & load it back by clicking the load button"
  },
  {
    id:8,
    text: "You can download the graph as an image or as json by clicking the download button on the top right corner of the graph panel"
  }
];

const InfoModal = ({ size, backdrop, isOpen, onClose }) => {
  return (
    <Modal
      size={size}
      backdrop={backdrop}
      isOpen={isOpen}
      onClose={onClose}
      className="text-black"
      closeButton={
        <div className="text-black">
          <IoCloseSharp size={24} />
        </div>
      }
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 p-4">
              <h1 className="text-xl md:text-3xl text-gray-600 text-center">
                Steps To Catch Your First Hacker:
              </h1>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-3 items-center justify-center text-black px-5 text-center">
                <hr />
                <hr />
                <div className="text-left flex flex-col gap-4 text-gray-500">
                  {steps.map((step) => (
                    <div key={step.id} className="justify-center">
                      <span className="text-xl md:text-2xl text-gray-500 mr-2">
                        #{step.id}
                      </span>
                      <span className="text-sm md:text-base">{step.text}</span>
                      <hr />
                    </div>
                  ))}
                </div>
                <hr />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default InfoModal;
