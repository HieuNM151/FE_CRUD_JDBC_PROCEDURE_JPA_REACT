import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ModalHuyNvDuAn from "./modalHuyNvDuAn";
import ModalUpdateNvDuAn from "./modalUpdate";
import ModalCreateNvDuAn from "./modalCreateNvDuAn";
import iconload from "../img/Synchronize.png";
import iconOut from "../img/Logout-2--Streamline-Ultimate.png";

const NvDuAnModal = ({ show, handleClose, handleReloadData, idnv }) => {
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [listDANV, setlistDANV] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedItemIdNV, setSelectedItemIdNV] = useState(null);

    const formatDate = (dateString) => {
        if (dateString) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(dateString).toLocaleDateString('en-GB', options);
        } else {
            return "Chưa kết thúc"; // or return ""; for blank
        }
    };
    
    const fetchData = useCallback(() => {
        if (idnv && idnv.trim() !== "") {
            fetch(`http://localhost:8081/api/v1/nhan-vien/details?id=${idnv}`)
                .then((res) => res.json())
                .then((resp) => {
                    setlistDANV(resp.listDANV);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    }, [idnv]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const RemoveFunctionn = (id) => {
        setSelectedItemId(id);
        setShowModal(true);
    };

    const handleCreate = (idnv) => {
        setSelectedItemIdNV(idnv);
        setShowModalCreate(true);
    };

    const handleShowModal = (id) => {
        setSelectedItemId(id);
        setShowModal2(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCloseModal2 = () => {
        setShowModal2(false);
    };

    const handleCloseModal3 = () => {
        setShowModalCreate(false);
        fetchData();
    };


    const handleDelete = () => {
        fetch(`http://localhost:8081/api/v1/nhan-vien-du-an/delete/${selectedItemId}`, {
            method: "POST"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Hủy kích hoạt thành công");
                    toast.success("Hủy kích hoạt thành công");
                    handleCloseModal();
                    fetchData();
                } else {
                    console.error("Hủy kích hoạt thất bại");
                    toast.error("Hủy kích hoạt thất bại");
                }
            })
            .catch(error => {
                console.error("Đã xảy ra lỗi khi xóa nhân viên:", error);
            });
    };

    const handleUpdate = () => {
        fetch(`http://localhost:8081/api/v1/nhan-vien-du-an/update/${selectedItemId}`, {
            method: "POST"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Update thành công");
                    toast.success("Update thành công");
                    handleCloseModal2();
                    fetchData();
                } else {
                    console.error("Update thất bại");
                    toast.error("Update thất bại");
                }
            })
            .catch(error => {
                console.error("Đã xảy ra lỗi khi Update nhân viên:", error);
            });
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Dự án nhân viên tham gia</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-lg-12 d-flex justify-content-end">
                        <button onClick={() => handleCreate(idnv)} className="btn btn-success" type="submit">Join dự án</button>
                    </div>
                </div>
                <br />
                <div className="container">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="bg-dark text-white">
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên dự án</th>
                                        <th>Ngày tham gia</th>
                                        <th>Ngày kết thúc</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listDANV.map((duan, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{duan.tenduan}</td>
                                            <td>{formatDate(duan.ngaythamgia)}</td>
                                            <td>{formatDate(duan.ngayketthuc)}</td>
                                            <td>{duan.trangthai ? "Hoạt động" : "Kết thúc"}</td>
                                            <td>
                                                <button onClick={() => handleShowModal(duan.id)} className="btn btn-outline-info"><img src={iconload} alt="iconload" style={{ width: '24px', height: '24px' }} /></button>
                                                <button onClick={() => RemoveFunctionn(duan.id)} className="btn btn-danger"><img src={iconOut} alt="icon" style={{width: '24px', height: '24px'}}/></button>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>
                    <ModalUpdateNvDuAn show={showModal2} handleClose={handleCloseModal2} handleUpdate={handleUpdate} />
                    <ModalHuyNvDuAn show={showModal} handleClose={handleCloseModal} handleDelete={handleDelete} />
                    <ModalCreateNvDuAn idnv={selectedItemIdNV} show={showModalCreate} handleClose={handleCloseModal3}/>

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

export default NvDuAnModal;
