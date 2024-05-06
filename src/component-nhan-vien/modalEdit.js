import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const EmpEditModal = ({ show, handleClose, handleReloadData, idnv }) => {
    const [name, setName] = useState("");
    const [namsinh, setNamsinh] = useState("");
    const [sdt, setSdt] = useState("");
    const [gioitinh, setGioiTinh] = useState("nam");
    const [trangthai, setTrangthai] = useState("Hoạt động");
    const [diachi, setDiaChi] = useState("");
    const [validationName, setValidationName] = useState(false);
    const [validationDate, setValidationDate] = useState(false);
    const [validationPhone, setValidationPhone] = useState(false);
    const [validationDc, setValidationDc] = useState(false);
    const [diaChiList, setDiaChiList] = useState([]);

    useEffect(() => {
        if (idnv && idnv.trim() !== "") { // Kiểm tra idnv không phải null hoặc chuỗi rỗng
            fetch("http://localhost:8081/api/v1/nhan-vien/get-dia-chi")
                .then(response => response.json())
                .then(data => {
                    setDiaChiList(data);
                })
                .catch(error => {
                    console.error("Đã xảy ra lỗi khi lấy danh sách địa chỉ:", error);
                });

            fetch(`http://localhost:8081/api/v1/nhan-vien/details?id=${idnv}`)
                .then((res) => res.json())
                .then((resp) => {
                    setName(resp.name);
                    setNamsinh(resp.namsinh.split(" ")[0]);
                    setSdt(resp.sdt);
                    setDiaChi(resp.diachi.id);
                    setGioiTinh(resp.gioitinh ? "nam" : "nu");
                    setTrangthai(resp.trangthai ? "Hoạt động" : "Nghỉ làm");
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    }, [idnv, show]); // Thêm show vào dependency để khi modal hiển thị, fetch dữ liệu mới

    const handleGenderChange = (event) => {
        setGioiTinh(event.target.value);
    };

    const handleGenderChange2 = (event) => {
        setTrangthai(event.target.value);
    };

    const handleValidation = () => {
        if (name.trim() === "" || namsinh.trim() === "" || sdt.trim() === "" || diachi.trim() === "") {
            toast.warning('Vui lòng điền đầy đủ thông tin');
            return false;
        }
        return true;
    };

    const handleAddEmployee = () => {
        if (handleValidation()) {
            const formData = {
                name: name,
                namsinh: namsinh,
                sdt: sdt,
                gioitinh: gioitinh === "nam" ? true : false,
                trangthai: trangthai === "Hoạt động" ? true : false,
                diachi: diachi
            };

            // Gọi API chỉ khi đủ điều kiện
            fetch(`http://localhost:8081/api/v1/nhan-vien/update?nhanVienId=${idnv}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    if (response.ok) {
                        console.log("Cập nhật thành công");
                        toast.success("Cập nhật thành công");
                        handleClose(); // Đóng modal sau khi thêm thành công
                        handleReloadData(); // Reload dữ liệu sau khi cập nhật thành công
                    } else {
                        console.error("Cập nhật thất bại");
                        toast.error("Cập nhật thất bại");
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
                <Modal.Title>Chỉnh sửa nhân viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="card">
                        <div className="card-body" style={{ "textAlign": "left" }}>
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Họ và Tên</label>
                                        <input value={name} required onMouseDown={() => setValidationName(true)} onChange={(e) => setName(e.target.value)} className="form-control"></input>
                                        {name && name.length === 0 && validationName && <span className="text-danger">Tên không được để trống</span>}
                                    </div>
                                </div>
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Ngày tháng năm sinh</label>
                                        <input value={namsinh} required onMouseDown={() => setValidationDate(true)} onChange={(e) => setNamsinh(e.target.value)} className="form-control" type="date"></input>
                                        {namsinh && namsinh.length === 0 && validationDate && <span className="text-danger">Ngày tháng năm sinh không được để trống</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">SĐT</label>
                                        <input value={sdt} required onMouseDown={() => setValidationPhone(true)} onChange={(e) => setSdt(e.target.value)} className="form-control"></input>
                                        {sdt && sdt.length === 0 && validationPhone && <span className="text-danger">SĐT không được để trống</span>}
                                    </div>
                                </div>
                                <div className="col-lg-3 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Giới tính</label>
                                        <div>
                                            <input type="radio" id="nam" name="gender" value="nam" checked={gioitinh === "nam"} className="form-check-input" onChange={handleGenderChange} />
                                            <label htmlFor="nam" className="form-check-label">Nam</label>
                                        </div>
                                        <div>
                                            <input type="radio" id="nu" name="gender" value="nu" checked={gioitinh === "nu"} className="form-check-input" onChange={handleGenderChange} />
                                            <label htmlFor="nu" className="form-check-label">Nữ</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Trạng thái</label>
                                        <div>
                                            <input type="radio" id="Hoạt động" name="trangthai" value="Hoạt động" checked={trangthai === "Hoạt động"} className="form-check-input" onChange={handleGenderChange2} />
                                            <label htmlFor="Hoạt động" required className="form-check-label">Hoạt động</label>
                                        </div>
                                        <div>
                                            <input type="radio" id="Nghỉ làm" name="trangthai" value="Nghỉ làm" checked={trangthai === "Nghỉ làm"} className="form-check-input" onChange={handleGenderChange2} />
                                            <label htmlFor="Nghỉ làm" required className="form-check-label">Nghỉ làm</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <div className="from-group">
                                        <label className="fw-bold">Địa chỉ</label>
                                        <select value={diachi} required onMouseDown={() => setValidationDc(true)} onChange={(e) => setDiaChi(e.target.value)} className="form-control">
                                            <option value="">Chọn địa chỉ</option>
                                            {diaChiList.map((diaChi, index) => (
                                                <option key={index} value={diaChi.id}>{`${diaChi.xa}, ${diaChi.huyen}, ${diaChi.tinh}`}</option>
                                            ))}
                                        </select>
                                        {diachi && diachi.length === 0 && validationDc && <span className="text-danger">Địa chỉ không được để trống</span>}
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
                    Cập nhật
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EmpEditModal;
