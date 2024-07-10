import React from "react";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";

import {
  EmailIcon,
  EmailShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

import { FaCopy } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "sonner";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";

const ShareModal = ({ size = "2xl", backdrop = "blur", isOpen, onClose }) => {
  const shareUrl = window.location.href;
  const title = "Here is what I found using Spectra🔮";

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
            <ModalHeader className="flex flex-col gap-1 text-2xl">
              Share your finds 🔎
            </ModalHeader>
            <ModalBody className="flex flex-wrap gap-4 justify-center p-5">
              <div className="w-full flex justify-between items-center gap-2 p-1 rounded-md bg-slate-400">
                <div className="bg-white p-2 rounded-md text-xs md:text-base overflow-x-auto py-2">
                  <Link
                    to={shareUrl}
                    target="_blank"
                    className="underline overflow-x-auto whitespace-nowrap"
                  >
                    {shareUrl}
                  </Link>
                </div>
                <CopyToClipboard
                  text={shareUrl}
                  onCopy={() => {
                    toast.success("Copied to clipboard!");
                    this.setState({ copied: true });
                  }}
                >
                  <span className="p-2 cursor-pointer border-2 border-black rounded-md bg-white">
                    <FaCopy />
                  </span>
                </CopyToClipboard>
              </div>
              <div className="flex justify-around items-center">
                <EmailShareButton
                  url={shareUrl}
                  subject={title}
                  body="Click the link to see what I found out"
                >
                  <EmailIcon size={38} round />
                </EmailShareButton>
                <TelegramShareButton url={shareUrl} title={title}>
                  <TelegramIcon size={38} round />
                </TelegramShareButton>
                <TwitterShareButton url={shareUrl} title={title}>
                  <TwitterIcon size={38} round />
                </TwitterShareButton>
                <WhatsappShareButton
                  url={shareUrl}
                  title={title}
                  separator=":: "
                >
                  <WhatsappIcon size={38} round />
                </WhatsappShareButton>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ShareModal;
