import React, { useState, useEffect, useCallback} from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ModalUpdateNvDuAn from "../component-nv-da/modalUpdate";
import ModalHuyNvDuAn from "../component-nv-da/modalHuyNvDuAn";
import iconOut from "../img/Logout-2--Streamline-Ultimate.png";
import iconloadd from "../img/Synchronize.png";


const ModalDetailDuAnNV = ({ show, handleClose, idda }) => {
    const [NVList, setNVList] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);

    const formatDate = (dateString) => {
        if (dateString) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(dateString).toLocaleDateString('en-GB', options);
        } else {
            return "Chưa kết thúc"; // or return ""; for blank
        }
    };

    const fetchData = useCallback(() => {
        if (idda && idda.trim() !== "") {
            fetch(`http://localhost:8081/api/v1/du-an/details?id=${idda}`)
                .then((res) => res.json())
                .then((resp) => {
                    setNVList(resp.listNVDA); // Thay đổi từ resp.NVList thành resp.listNVDA
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    });

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleShowModal = (idnhanvien) => {
        setSelectedItemId(idnhanvien);
        setShowModal2(true);
    };

    const RemoveFunctionn = (idnhanvien) => {
        setSelectedItemId(idnhanvien);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCloseModal2 = () => {
        setShowModal2(false);
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
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Nhân viên đã tham gia dự án</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="bg-dark text-white">
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên nhân viên</th>
                                        <th>Năm sinh</th>
                                        <th>Ngày tham gia</th>
                                        <th>Ngày kết thúc</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {NVList && NVList.length > 0 && NVList.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{formatDate(item.namsinh)}</td>
                                            <td>{formatDate(item.ngaythamgia)}</td>
                                            <td>{formatDate(item.ngayketthuc)}</td>
                                            <td>{item.trangthai ? 'Hoạt động' : 'Kết thúc'}</td>
                                            <td>
                                                <button onClick={() => handleShowModal(item.id)} className="btn btn-info"><img src={iconloadd} alt="icon" style={{width: '24px', height: '24px'}}/></button>
                                                <button onClick={() => RemoveFunctionn(item.id)} className="btn btn-danger"><img src={iconOut} alt="icon" style={{width: '24px', height: '24px'}}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <ModalUpdateNvDuAn show={showModal2} handleClose={handleCloseModal2} handleUpdate={handleUpdate} />
                    <ModalHuyNvDuAn show={showModal} handleClose={handleCloseModal} handleDelete={handleDelete} />
                </div>

            </Modal.Body>
         
        </Modal>
    );
};

export default ModalDetailDuAnNV;
