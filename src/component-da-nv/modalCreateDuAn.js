import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ModalCreateDA = ({ show, handleClose, handleAddEmployeeModal, fetchDuAn }) => {
    const [tenduan, setTenduan] = useState("");
    const [ngaybatdau, setngaybatdau] = useState("");
    const [ngayketthuc, setngayketthuc] = useState("");
    const [trangthai, settrangthai] = useState("Đang diễn ra");
    const [validationName, setValidationName] = useState(false);
    const [validationngaybatdau, setValidationngaybatdau] = useState(false);
    const [validationngayketthuc, setValidationngayketthuc] = useState(false);
    const [validationDc, setValidationDc] = useState(false);
    const [diaChiList, setDiaChiList] = useState([]);


    const handleGenderChange = (event) => {
        settrangthai(event.target.value);
    };

    const handleValidation = () => {
        if (tenduan.trim() === "" || ngaybatdau.trim() === "") {
            toast.warning('Vui lòng điền đầy đủ thông tin');
            return false;
        }
        return true;
    };

    const handleAddEmployee = () => {
        if (handleValidation()) {
            const formData = {
                tenduan: tenduan,
                ngaybatdau: ngaybatdau,
                ngayketthuc: ngayketthuc,
                trangthai: trangthai === "Đang diễn ra" ? true : false,
            };
    
            // Gọi API chỉ khi đủ điều kiện
            fetch("http://localhost:8081/api/v1/du-an/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    if (response.ok) {
                        console.log("Thêm thành công");
                        toast.success('Thêm thành công');
                        handleClose();
                        fetchDuAn();
                    } else {
                        console.error("Thêm thất bại");
                        return response.json();
                    }
                })
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Thêm mới dự án</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="card">
                        <div className="card-body" style={{ "textAlign": "left" }}>
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Tên dự án</label>
                                        <input value={tenduan} required onMouseDown={() => setValidationName(true)} onChange={(e) => setTenduan(e.target.value)} className="form-control"></input>
                                        {tenduan.length === 0 && validationName && <span className="text-danger">Tên dự án không được để trống</span>}
                                    </div>
                                </div>
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Ngày bắt đầu</label>
                                        <input value={ngaybatdau} required onMouseDown={() => setValidationngaybatdau(true)} onChange={(e) => setngaybatdau(e.target.value)} className="form-control" type="date"></input>
                                        {ngaybatdau.length === 0 && validationngaybatdau && <span className="text-danger">Ngày bắt đầu không được để trống</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Ngày kết thúc</label>
                                        <input value={ngayketthuc} required onChange={(e) => setngayketthuc(e.target.value)} className="form-control" type="date"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Trạng thái</label>
                                        <div>
                                            <input type="radio" id="Đang diễn ra" name="gender" value="Đang diễn ra" checked={trangthai === "Đang diễn ra"} className="form-check-input" onChange={handleGenderChange} />
                                            <label htmlFor="Đang diễn ra" required className="form-check-label">Đang diễn ra</label>
                                        </div>
                                        <div>
                                            <input type="radio" id="Kết thúc" name="gender" value="Kết thúc" checked={trangthai === "Kết thúc"} className="form-check-input" onChange={handleGenderChange} />
                                            <label htmlFor="Kết thúc" required className="form-check-label">Kết thúc</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="success" onClick={handleAddEmployee}>
                    Thêm mới
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalCreateDA;