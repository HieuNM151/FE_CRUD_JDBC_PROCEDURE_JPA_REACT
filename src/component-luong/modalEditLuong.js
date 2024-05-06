import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';


const EditLuongModal = ({ show, handleClose, handleReloadData, idnv }) => {
    const [showModal, setShowModal] = useState(false);

    const [luongList, setLuongList] = useState([]);

    const [theloai, settheloai] = useState("");
    const [mucluong, setmucluong] = useState("");
    const [ngaybatdau, setngaybatdau] = useState("");
    const [ngayketthuc, setngayketthuc] = useState("");
    const [trangthai, settrangthai] = useState("Hoạt động");
    const [selectedItemId, setSelectedItemId] = useState(null);

    const [validationName, setValidationName] = useState(false);
    const [validationDate, setValidationDate] = useState(false);
    const [validationPhone, setValidationPhone] = useState(false);

    // const formatMoney = (amount) => {
    //     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    // };

    // const formatInputMoney = (value) => {
    //     if (typeof value !== 'string') {
    //         return value;
    //     }

    //     let formattedValue = value.replace(/\D/g, '');
    //     formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    //     return formattedValue;
    // };
    
    const handleRefresh = () => {
        settheloai('');
        setmucluong('');
        setngaybatdau('');
        setngayketthuc('');
        settrangthai('Hoạt động');
    };
    
    const fetchData = () => {
        if (idnv && idnv.trim() !== "") {
            fetch(`http://localhost:8081/api/v1/luong/details?id=${idnv}`)
                .then((res) => res.json())
                .then((resp) => {
                    settheloai(resp.theloai);
                    setmucluong(resp.mucluong);
                    setngaybatdau(resp.ngaybatdau);
                    setngayketthuc(resp.ngayketthuc);
                    settrangthai(resp.trangthai ? "Hoạt động" : "Ngừng hoạt động");
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    };

    useEffect(() => {
        fetchData();
    }, [idnv]);

    const handleGenderChange = (event) => {
        settrangthai(event.target.value);
    };

    const handleValidation = () => {
        if (theloai.trim() === "" || ngaybatdau.trim() === "") {
            toast.warning('Vui lòng điền đầy đủ thông tin');
            return false;
        }
        return true;
    };
    

    const handleUpdateLuong = () => {
        if (handleValidation()) {
            const formData = {
                theloai: theloai,
                mucluong: mucluong,
                ngaybatdau: ngaybatdau,
                ngayketthuc: ngayketthuc,
                trangthai: trangthai === "Hoạt động" ? true : false
            };

            fetch(`http://localhost:8081/api/v1/luong/update?id=${idnv}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    if (response.ok) {
                        console.log("Cập nhật Lương cho nhân viên thành công");
                        toast.success("Cập nhật Lương cho nhân viên thành công");
                        handleRefresh()
                        handleClose();
                        fetchData();
                    } else {
                        console.error("Cập nhật Lương cho nhân viên thất bại");
                        toast.error("Cập nhật Lương cho nhân viên thất bại");
                    }
                })
                .then(data => {
                    if (data) {
                        console.error("Đã xảy ra lỗi khi cập nhật nhân viên:", data);
                    }
                })
                .catch(error => {
                    console.error("Đã xảy ra lỗi khi cập nhật nhân viên:", error);
                });
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="md">
            <Modal.Header closeButton>
                <Modal.Title>Bảng lương của nhân viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="card">
                        <div className="card-body" style={{ "textAlign": "left" }}>
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Thể loại lương</label>
                                        <input value={theloai} required onMouseDown={() => setValidationName(true)} onChange={(e) => settheloai(e.target.value)} className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Mức lương</label>
                                        <input value={mucluong} required onMouseDown={() => setValidationPhone(true)} onChange={(e) => setmucluong(e.target.value)} className="form-control"></input>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Ngày bắt đầu</label>
                                        <input value={ngaybatdau} required onMouseDown={() => setValidationDate(true)} onChange={(e) => setngaybatdau(e.target.value)} className="form-control" type="date"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Ngày kết thúc</label>
                                        <input value={ngayketthuc} required onMouseDown={() => setValidationDate(true)} onChange={(e) => setngayketthuc(e.target.value)} className="form-control" type="date"></input>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Trạng thái</label>
                                        <div>
                                            <input type="radio" id="nam" name="gender" value="Hoạt động" checked={trangthai === "Hoạt động"} className="form-check-input" onChange={handleGenderChange} />
                                            <label htmlFor="nam" className="form-check-label">Hoạt động</label>
                                        </div>
                                        <div>
                                            <input type="radio" id="nu" name="gender" value="Ngừng hoạt động" checked={trangthai === "Ngừng hoạt động"} className="form-check-input" onChange={handleGenderChange} />
                                            <label htmlFor="nu" className="form-check-label">Ngừng hoạt động</label>
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
                <Button variant="success" onClick={handleUpdateLuong}>
                    Cập nhật
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditLuongModal;
