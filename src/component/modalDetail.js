import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import { useParams } from "react-router-dom";

const EmpDetailModal = ({ show, handleClose, idnv }) => {
    const [emplData, setEmplData] = useState({});
    const { idnv: empId } = useParams(); // Lấy giá trị của idnv từ URL

    useEffect(() => {
        if (idnv && idnv.trim() !== "") { // Kiểm tra idnv không phải null hoặc chuỗi rỗng
            fetch(`http://localhost:8081/api/v1/nhan-vien/details?id=${idnv}`)
                .then((res) => res.json())
                .then((resp) => {
                    setEmplData(resp);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    }, [idnv]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };
    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết nhân viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {emplData && (
                    <div className="container">
                        <div className="card">
                            <div className="card-body" style={{ "textAlign": "left" }}>
                                <div className="row">
                                    <div className="col-lg-6 mb-3">
                                        <div className="from-group">
                                            <label className="fw-bold">Họ và Tên: {emplData.name}</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                        <div className="from-group">
                                            <label className="fw-bold">Ngày tháng năm sinh: {formatDate(emplData.namsinh)}</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 mb-3">
                                        <div className="from-group">
                                            <label className="fw-bold">SĐT: {emplData.sdt}</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                        <div className="from-group">
                                            <label className="fw-bold">Giới tính: {emplData.gioitinh ? "Nam" : "Nữ"}</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 mb-3">
                                        <div className="from-group">
                                            <label className="fw-bold">Địa chỉ: {emplData.diachi && emplData.diachi.huyen}, {emplData.diachi && emplData.diachi.xa}, {emplData.diachi && emplData.diachi.tinh}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EmpDetailModal;
