import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import iconCL from "../img/Arrow-Left.png";
import iconCR from "../img/Arrow-Right.png";
import iconJ from "../img/LoginStreamline.png";
import ReactPaginate from 'react-paginate';

const ModalCreateNvDuAn = ({ show, handleClose, idnv }) => {
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [projects, setProjects] = useState([]);
    const [nhanVienId, setnhanVienId] = useState("");
    const [duAnId, setduAnId] = useState("");

    const formatDate = (dateString) => {
        if (dateString) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(dateString).toLocaleDateString('en-GB', options);
        } else {
            return "Chưa kết thúc"; // or return ""; for blank
        }
    };
    useEffect(() => {
        const fetchData = () => {
            fetch(`http://localhost:8081/api/v1/du-an/get-all?pageNumber=${pageNumber}&pageSize=${pageSize}`)
                .then((res) => res.json())
                .then((resp) => {
                    setProjects(resp.content);
                    setTotalPages(resp.totalPages);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        };

        fetchData();
    }, [pageNumber, pageSize]);

    const handlePageClick = (data) => {
        const selectedPage = data.selected;
        setPageNumber(selectedPage);
    };

    const handleAddEmployee = (projectId) => {
        const formData = {
            nhanVienId: idnv,
            duAnId: projectId
        };

        fetch(`http://localhost:8081/api/v1/nhan-vien-du-an/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Nhân viên join dự án thành công");
                    toast.success("Nhân viên join dự án thành công");
                } else {
                    console.error("Nhân viên đã join dự án này!");
                    toast.warning("Nhân viên đã join dự án này!");
                }
            })
            .then(data => {
                if (data) {
                    console.error("Đã xảy ra lỗi khi Nhân viên join dự án:", data);
                }
            })
            .catch(error => {
                console.error("Đã xảy ra lỗi khi Nhân viên join dự án:", error);
            });
    };



    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Danh sách dự án</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="bg-dark text-white">
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên dự án</th>
                                        <th>Ngày bắt đầu</th>
                                        <th>Ngày kết thúc</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{project.tenduan}</td>
                                            <td>{formatDate(project.ngaybatdau)}</td>
                                            <td>{formatDate(project.ngayketthuc)}</td>
                                            <td>{project.trangthai ? "Hoạt động" : "Kết thúc"}</td>
                                            <td>
                                                <button onClick={() => handleAddEmployee(project.id)} className="btn btn-outline-info">
                                                    <img src={iconJ} alt="iconload" style={{ width: '24px', height: '24px' }} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
                <div className="pagination justify-content-center">
                    <ReactPaginate
                        forcePage={pageNumber}
                        breakLabel="..."
                        nextLabel={<span dangerouslySetInnerHTML={{ __html: "<img src='" + iconCR + "'style='width: 20px; height: 20px;' />" }} />}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={6}
                        pageCount={totalPages}
                        previousLabel={<span dangerouslySetInnerHTML={{ __html: "<img src='" + iconCL + "' style='width: 20px; height: 20px;' />" }} />}
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalCreateNvDuAn;
