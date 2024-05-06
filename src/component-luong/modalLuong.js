import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ModalHuy from "../component-luong/modalHuyLuong";
import EditLuongModal from "../component-luong/modalEditLuong";

const LuongModal = ({ show, handleClose, handleReloadData, idnv }) => {
    const [showModal, setShowModal] = useState(false);
    const [showModalEditLuong, setShowModalEditLuong] = useState(false);

    const [luongList, setLuongList] = useState([]);

    const [tongluong, settongluong] = useState("");
    const [theloai, settheloai] = useState("");
    const [mucluong, setmucluong] = useState("");
    const [ngaybatdau, setngaybatdau] = useState("");
    const [ngayketthuc, setngayketthuc] = useState("");
    const [trangthai, settrangthai] = useState("Hoạt động");

    const [selectedItemId, setSelectedItemId] = useState(null);
    const [validationName, setValidationName] = useState(false);
    const [validationDate, setValidationDate] = useState(false);
    const [validationPhone, setValidationPhone] = useState(false);

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatInputMoney = (value) => {
        let formattedValue = value.replace(/\D/g, '');

        formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return formattedValue;
    };

    const handleRefresh = () => {
        settheloai('');
        setmucluong('');
        setngaybatdau('');
        setngayketthuc('');
        settrangthai('Hoạt động');
    };
    const fetchData = () => {
        if (idnv && idnv.trim() !== "") {
            fetch(`http://localhost:8081/api/v1/nhan-vien/details?id=${idnv}`)
                .then((res) => res.json())
                .then((resp) => {
                    setLuongList(resp.luongList);
                    settongluong(resp.tongLuong);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    };

    const formatDate = (dateString) => {
        if (dateString) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(dateString).toLocaleDateString('en-GB', options);
        } else {
            return "Chưa kết thúc"; // or return ""; for blank
        }
    };

    useEffect(() => {
        fetchData();
    }, [idnv]);
    
   
    const RemoveFunction = (id) => {
        setSelectedItemId(id);
        setShowModal(true);
    };

    const handleShowEditModal = (id) => {
        setSelectedItemId(id);
        setShowModalEditLuong(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCloseModalEdit = () => {
        fetchData();
        setShowModalEditLuong(false);
    };

    const handleDelete = () => {
        fetch(`http://localhost:8081/api/v1/luong/delete/${selectedItemId}`, {
            method: "POST"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Hủy kích hoạt thành công");
                    toast.success("Hủy kích hoạt thành công");
                    fetchData();
                    handleCloseModal();
                } else {
                    console.error("Hủy kích hoạt thất bại");
                    toast.error("Hủy kích hoạt thất bại");
                }
            })
            .catch(error => {
                console.error("Đã xảy ra lỗi khi xóa nhân viên:", error);
            });
    };

    const handleGenderChange = (event) => {
        settrangthai(event.target.value);
    };

    const handleValidation = () => {
        if (theloai.trim() === "" || mucluong.trim() === "" || ngaybatdau.trim() === "") {
            toast.warning('Vui lòng điền đầy đủ thông tin');
            return false;
        }
        return true;
    };

    const handleAddEmployee = () => {
        if (handleValidation()) {
            const formData = {
                theloai: theloai,
                mucluong: mucluong,
                ngaybatdau: ngaybatdau,
                ngayketthuc: ngayketthuc,
                trangthai: trangthai === "Hoạt động" ? true : false
            };

            fetch(`http://localhost:8081/api/v1/luong/create-luong-nv/${idnv}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    if (response.ok) {
                        console.log("Thêm Lương cho nhân viên thành công");
                        toast.success("Thêm Lương cho nhân viên thành công");
                        handleRefresh();
                        fetchData();
                    } else {
                        console.error("Thêm Lương cho nhân viên thất bại");
                        toast.error("Thêm Lương cho nhân viên thất bại");
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
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg">
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
                                        <input value={formatInputMoney(mucluong)} required onMouseDown={() => setValidationPhone(true)} onChange={(e) => setmucluong(formatInputMoney(e.target.value))} className="form-control"></input>
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
                                            <input type="radio" id="hoatdong" name="status" value="Hoạt động" checked={trangthai === "Hoạt động"} className="form-check-input" onChange={handleGenderChange} />
                                            <label htmlFor="hoatdong" className="form-check-label">Hoạt động</label>
                                        </div>
                                        <div>
                                            <input type="radio" id="ngung" name="status" value="Ngừng hoạt động" checked={trangthai === "Ngừng hoạt động"} className="form-check-input" onChange={handleGenderChange} />
                                            <label htmlFor="ngung" className="form-check-label">Ngừng hoạt động</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 d-flex justify-content-end">
                                    <button onClick={handleAddEmployee} className="btn btn-success" type="submit">Thêm mức lương</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="bg-dark text-white">
                                    <tr>
                                        <th>STT</th>
                                        <th>Thể loại lương</th>
                                        <th>Mức Lương</th>
                                        <th>Ngày bắt đầu</th>
                                        <th>Ngày kết thúc</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {luongList.map((luong, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{luong.theloai}</td>
                                            <td>{formatMoney(luong.mucluong)}</td>
                                            <td>{formatDate(luong.ngaybatdau)}</td>
                                            <td>{formatDate(luong.ngayketthuc)}</td>
                                            <td>{luong.trangthai ? "Hoạt động" : "Ngừng hoạt động"}</td>
                                            <td>
                                                <button onClick={() => handleShowEditModal(luong.id, luong.trangthai)} className="btn btn-info">Sửa</button>
                                                <button onClick={() => RemoveFunction(luong.id)} className="btn btn-danger">Xóa</button>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                        <h3>Tổng lương của nhân viên: {formatMoney(tongluong)}</h3>
                    </div>
                    <ModalHuy show={showModal} handleClose={handleCloseModal} handleDelete={handleDelete} />
                    <EditLuongModal idnv={selectedItemId} show={showModalEditLuong} handleClose={handleCloseModalEdit} trangThai={trangthai} />

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LuongModal;
