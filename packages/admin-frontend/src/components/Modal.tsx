import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function MyModal({
  title,
  body,
  show: showProp,
  onCloseModal,
  onSubmit,
}: {
  title: string;
  body: React.ReactNode;
  show: boolean;
  onCloseModal: () => void;
  onSubmit(): () => void;
}) {
  const [show, setShow] = useState(showProp);

  const handleClose = () => {
    setShow(false);
    onCloseModal();
  };

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <>
      <Modal dir="rtl" show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            بستن
          </Button>
          <Button onClick={handleSubmit} variant="danger">
            حذف
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MyModal;
