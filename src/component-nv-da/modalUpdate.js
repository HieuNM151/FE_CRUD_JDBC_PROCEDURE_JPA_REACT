import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalUpdateNvDuAn = ({ show, handleClose, handleUpdate }) => {
    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận</Modal.Title>
            </Modal.Header>
            <Modal.Body>Bạn có chắc chắn muốn kích hoạt này?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="success" onClick={handleUpdate}>
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalUpdateNvDuAn;
