import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import ModalDelete from "../component/modalDelete";
import EmpCreateModal from "../component/modalCreate";
import EmpEditModal from "../component/modalEdit";
import EmpDetailModal from "../component/modalDetail";
import LuongModal from "../component/modalLuong";
import icon from "../img/Coupon.png";
import iconCL from "../img/Arrow-Left.png";
import iconCR from "../img/Arrow-Right.png";

const EmpListing = () => {
    const [emplData, setEmplData] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchInput, setSearchInput] = useState('');
    const [gender, setGender] = useState('');
    const [dateForm, setDateForm] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedItemIddl, setSelectedItemIddl] = useState(null);
    const [selectedItemIdLuong, setSelectedItemIdLuong] = useState(null);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLuongModal, setShowLuongModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [reloadPage, setReloadPage] = useState(false);

    const handleShowCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => setShowCreateModal(false);
    const handleShowEditModal = (id) => {
        setSelectedItemId(id);
        setShowEditModal(true);
    };
    const handleShowDetailModal = (id) => {
        setSelectedItemIddl(id);
        setShowDetailModal(true);
    };
    const handleShowLuongModal = (id) => {
        setSelectedItemIdLuong(id);
        setShowLuongModal(true);
    };

    const handleCloseEditModal = () => setShowEditModal(false);
    const handleCloseDetailModal = () => setShowDetailModal(false);
    const handleCloseLuongModal = () => setShowLuongModal(false);
    const handleReloadData = () => {
        handleSearch(); // Gọi lại hàm handleSearch để load dữ liệu mới
    };

    const LoadDetail = (id) => {
        navigate("/employee/detail/" + id);
    };

    const LoadEdit = (id) => {
        navigate("/employee/edit/" + id);
    };

    const RemoveFunction = (id) => {
        setSelectedItemId(id);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };
    const handleDelete = () => {
        fetch(`http://localhost:8081/api/v1/nhan-vien/delete/${selectedItemId}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Xóa thành công");
                    toast.success("Xóa thành công");
                    handleCloseModal();
                    handleSearch();
                } else {
                    console.error("Xóa thất bại");
                    toast.error("Xóa thất bại");
                }
            })
            .catch(error => {
                console.error("Đã xảy ra lỗi khi xóa nhân viên:", error);
            });
    };

    const handleSearch = () => {
        const requestData = {
            name: searchInput,
            gioitinh: gender,
            ngayBatDau: dateForm,
            ngayKetThuc: dateTo,
            page: pageNumber,
            pageSize: pageSize,
            database: "nhan_vien",
            server: "com.microsoft.sqlserver.jdbc.SQLServerDriver"
        };

        fetch(`http://localhost:8081/api/v1/nhan-vien/search-native`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        })
            .then((res) => res.json())
            .then((resp) => {
                setEmplData(resp.resultList);
                setTotalPages(resp.totalPages);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const handlePageClick = (data) => {
        const selectedPage = data.selected;
        setPageNumber(selectedPage);
        handleSearch();
    };

    const handleRefresh = () => {
        setSearchInput('');
        setGender('');
        setDateForm('');
        setDateTo('');
        setPageNumber(0);
        setRefreshFlag(true);
    };

    useEffect(() => {
        handleSearch();
    }, [pageNumber, pageSize, searchInput, gender, dateForm, dateTo, refreshFlag, reloadPage]);

    useEffect(() => {
        if (refreshFlag) {
            toast.success('Làm mới thành công');
            setRefreshFlag(false);
        }
    }, [refreshFlag]);

    return (
        <div className="container">
            <div className="card">
                <h2 className="card-title">Danh sách nhân viên</h2>

                <div className="row" style={{ display: "flex", marginBottom: "20px" }}>
                    <div className="col-4">
                        <input
                            className="form-control"
                            placeholder="Tìm theo Tên, SĐT"
                            style={{ marginTop: "4px", marginLeft: "20px" }}
                            value={searchInput}
                            onChange={(e) => {setSearchInput(e.target.value); setPageNumber(0)}}
                        />
                    </div>
                    <div className="col-4 d-flex justify-content-start">
                        <button className="btn btn-warning" onClick={handleRefresh}>
                            Làm mới
                        </button>
                    </div>
                    <div className="col-2 d-flex justify-content-start" >
                        <label className="form-label" style={{ marginTop: "11px" }}>Giới tính :</label>
                        <select style={{ color: "green", border: "none" }} className="custom-select"
                            value={gender}
                            onChange={(e) => { setGender(e.target.value); setPageNumber(0) }}>
                            <option value="">Tất cả</option>
                            <option value="1">Nam</option>
                            <option value="0">Nữ</option>
                        </select>
                    </div>
                    <div className="col-2">
                        <button className="btn btn-success" onClick={handleShowCreateModal}>Thêm mới</button>
                       </div>
                </div>
                <div className="row" style={{ marginBottom: "20px", marginLeft: "20px" }}>
                    <div className="col-lg-3 mb-3">
                        <div className="from-group">
                            <label className="fw-bold">Tìm kiếm theo ngày từ:</label>
                            <input value={dateForm} onChange={(e) => {setDateForm(e.target.value);setPageNumber(0)}} className="form-control" type="date"></input>
                        </div>
                    </div>
                    <div className="col-lg-3 mb-3">
                        <div className="from-group">
                            <label className="fw-bold">Đến ngày:</label>
                            <input value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPageNumber(0); }} className="form-control" type="date"></input>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>STT</th>
                                <th>Tên</th>
                                <th>Năm sinh</th>
                                <th>Giới tính</th>
                                <th>Phone</th>
                                <th>Địa chỉ</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emplData?.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{formatDate(item.namsinh)}</td>
                                    <td>{item.gioitinh ? "Nam" : "Nữ"}</td>
                                    <td>{item.sdt}</td>
                                    <td>{item.xa}, {item.huyen}, {item.tinh}</td>
                                    <td>
                                        <button onClick={() => handleShowEditModal(item.id)} className="btn btn-info">Sửa</button>
                                        <button onClick={() => RemoveFunction(item.id)} className="btn btn-danger">Xóa</button>
                                        <button onClick={() => handleShowDetailModal(item.id)} className="btn btn-warning">Chi tiết</button>
                                        <button onClick={() => handleShowLuongModal(item.id)} className="btn btn-outline-info"><img src={icon} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="pagination justify-content-center">
                    <ReactPaginate
                        forcePage={pageNumber}
                        breakLabel="..."
                        nextLabel={<span dangerouslySetInnerHTML={{ __html: "<img src='" + iconCR + "'style='width: 20px; height: 20px;' />" }} />}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={2}
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
            </div>
            {showCreateModal && <EmpCreateModal show={showCreateModal} handleClose={handleCloseCreateModal} handleAddEmployeeModal={handleReloadData} handleReloadData={handleReloadData} />}
            <ModalDelete show={showModal} handleClose={handleCloseModal} handleDelete={handleDelete} />
            <EmpEditModal idnv={selectedItemId} show={showEditModal} handleReloadData={handleReloadData} handleClose={handleCloseEditModal} />
            <EmpDetailModal idnv={selectedItemIddl} show={showDetailModal} handleClose={handleCloseDetailModal} />
            <LuongModal idnv={selectedItemIdLuong} show={showLuongModal} handleClose={handleCloseLuongModal} />
        </div>
    );
};

export default EmpListing;
