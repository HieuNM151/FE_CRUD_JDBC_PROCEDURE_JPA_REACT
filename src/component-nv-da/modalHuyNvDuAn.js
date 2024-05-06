import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalHuyNvDuAn = ({ show, handleClose, handleDelete }) => {
    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận hủy kích hoạt</Modal.Title>
            </Modal.Header>
            <Modal.Body>Bạn có chắc chắn muốn hủy kích hoạt này?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalHuyNvDuAn;
