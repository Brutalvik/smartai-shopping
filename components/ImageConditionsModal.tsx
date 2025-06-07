"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@heroui/modal";
import Image from "next/image";

interface ImageConditionsModalProps {
  open: boolean;
  onClose: () => void;
}

const ImageConditionsModal: React.FC<ImageConditionsModalProps> = ({ open, onClose }) => {
  return (
    <Modal isOpen={open} onOpenChange={onClose} placement="center">
      <ModalContent className="max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl p-4 shadow-xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        />


        {/* Branded header */}
        <ModalHeader className="flex items-center gap-3 text-xl font-semibold">
          <Image
            src="/xyvo.png"
            alt="Xyvo Logo"
            width={28}
            height={28}
            className="rounded-md"
          />
          Image Upload Terms
        </ModalHeader>

        {/* Modal body */}
        <ModalBody className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            By uploading images to <strong>Xyvo</strong>, you affirm and agree that you are solely and fully responsible
            for the content you submit. You further confirm that:
          </p>

          <ul className="list-disc pl-5 space-y-2">
            <li>
              You are the legal owner of the images or have been granted explicit, verifiable permission to upload and use them.
            </li>
            <li>
              The images do not violate copyright, trademark, privacy, or moral rights under applicable laws in
              <strong> Canada (Copyright Act, Criminal Code), the United States (DMCA, COPPA),</strong> or
              <strong> Indonesia (ITE Law, Pornography Law).</strong>
            </li>
            <li>
              You will not upload any images that depict, imply, or involve minors (children) in any way that is exploitative,
              suggestive, harmful, abusive, or otherwise unlawful. Such content is strictly prohibited and will be reported
              to relevant authorities.
            </li>
            <li>
              You will not upload images containing explicit, violent, hateful, threatening, defamatory, or illegal content,
              including depictions of self-harm, weapons, or drugs.
            </li>
            <li>
              You grant <strong>Xyvo</strong> a non-exclusive, royalty-free, worldwide license to display and process the images
              for the purposes of product presentation and user experience optimization.
            </li>
          </ul>

          <p>
            Uploading images that breach these terms may result in permanent removal of your account and notification to law
            enforcement agencies in accordance with applicable international and national laws.
          </p>

          <p className="mt-4 font-medium">
            As the uploader, <strong>you assume full civil and criminal liability</strong> for any consequences arising from
            illegal or unauthorized image content.
          </p>
        </ModalBody>

        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default ImageConditionsModal;
