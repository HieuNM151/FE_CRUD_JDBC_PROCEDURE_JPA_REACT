import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import iconCV from "../img/Streamline.png";
import ModalDuAnCreateNv from "../component-da-nv/modalDuAnCreateNv";
import iconCL from "../img/Arrow-Left.png";
import iconCR from "../img/Arrow-Right.png";
import iconUp from "../img/Cursor-Choose--Streamline-Ultimate.png";
import ModalDetailDuAnNV from "../component-da-nv/modalDuAnDetail";
import ModalDADelete from "../component-da-nv/modalDuAnDelete";
import ModalCreateDA from "../component-da-nv/modalCreateDuAn";
import ModalUpdateDA from "../component-da-nv/modalDuAnUpdate";


const DuAnList = () => {
    const [DuAn, setDuAn] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [trangthai, setTrangthai] = useState('');
    const [tenduan, setTenduan] = useState('');
    const [size, setSize] = useState(5);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [selectedItemIdDA, setselectedItemIdDA] = useState(null);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalDetail, setShowModalDetail] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalCreateNew, setShowModalCreateNew] = useState(false);

    useEffect(() => {
        fetchDuAn();
    }, [currentPage]); 

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };
    // create nhân viên vào dự án
    const handleCreate = (id) => {
        setselectedItemIdDA(id);
        setShowModalCreate(true);
    };

    const handleCloseModal3 = () => {
        setShowModalCreate(false);
    };
    // Details danh sách nhân viên trong dự án
    const handleDetail = (id) => {
        setselectedItemIdDA(id);
        setShowModalDetail(true);
    };

    const handleCloseModaldetail = () => {
        setShowModalDetail(false);
    };
    // Delete dự án
    const handleDelete = (id) => {
        setselectedItemIdDA(id);
        setShowModalDelete(true);
    };

    const handleCloseModaldelete = () => {
        setShowModalDelete(false);
    };
    //Create mew dự án
    const handleCreateNew = () => {
        setShowModalCreateNew(true);
    };

    const handleCloseModalCreateNew = () => {
        setShowModalCreateNew(false);
    };

    // Update dự án
    const handleUpdate = (id) => {
        setselectedItemIdDA(id);
        setShowModalEdit(true);
    };

    const handleCloseModalUpdate = () => {
        setShowModalEdit(false);
    };


    const handleRefresh = () => {
        setTenduan('');
        setTrangthai('');
        setCurrentPage(0);
        setRefreshFlag(true);
    };

    const fetchDuAn = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/v1/du-an/get-all?pageNumber=${currentPage}&pageSize=${size}&trangthai=${trangthai}&tenduan=${tenduan}`);
            if (!response.ok) {
                throw new Error('Failed to fetch luong data');
            }
            const data = await response.json();
            setDuAn(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching luong data:', error);
        }
    };

    const Delete = () => {
        fetch(`http://localhost:8081/api/v1/du-an/delete/${selectedItemIdDA}`, {
            method: "POST"
        })
            .then(response => {
                if (response.ok) {
                    toast.success("Kết thúc dự án thành công");
                    handleCloseModaldelete();
                    fetchDuAn();
                } else {
                    toast.error("Kết thúc dự án thất bại");
                }
            })
            .catch(error => {
                console.error("Đã xảy ra lỗi khi xóa nhân viên:", error);
            });
    };

    useEffect(() => {
        fetchDuAn();
    }, [currentPage, totalPages, tenduan, trangthai, refreshFlag]);

    useEffect(() => {
        if (refreshFlag) {
            toast.success('Làm mới thành công');
            setRefreshFlag(false);
        }
    }, [refreshFlag]);

    return (
        <div className="container">
            <div className="card">
                <h2 className="card-title">Quản lý dự án</h2>
                
                <div className="row" style={{ display: "flex", marginBottom: "20px" }}>
                    <div className="col-4">
                        <input
                            className="form-control"
                            placeholder="Tìm theo Tên dự án"
                            style={{ marginTop: "4px", marginLeft: "20px" }}
                            value={tenduan}
                            onChange={(e) => { setTenduan(e.target.value); setCurrentPage(0) }}
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
                            value={trangthai}
                            onChange={(e) => { setTrangthai(e.target.value); setCurrentPage(0) }}>
                            <option value="">Tất cả</option>
                            <option value="1">Đang diễn ra</option>
                            <option value="0">Kết thúc</option>
                        </select>
                    </div>
                    <div className="col-2">
                    <button onClick={() => handleCreateNew()} className="btn btn-success">Thêm mới</button>
                    </div>
                </div>
            </div>

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
                            {DuAn.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.tenduan}</td>
                                    <td>{item.ngaybatdau}</td>
                                    <td>{item.ngayketthuc}</td>
                                    <td>{item.trangthai ? 'Đang diễn ra' : 'Kết thúc'}</td>
                                    <td>
                                        <button onClick={() => handleUpdate(item.id)} className="btn btn-info">Sửa</button>
                                        <button onClick={() => handleDelete(item.id)} className="btn btn-danger">Kết thúc</button>
                                        <button onClick={() => handleDetail(item.id)} className="btn btn-outline-warning"><img src={iconUp} alt="icon" style={{width: '24px', height: '24px'}}/></button>
                                        <button onClick={() => handleCreate(item.id)} className="btn btn-outline-secondary"> <img src={iconCV} alt="icon" style={{width: '24px', height: '24px'}}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="pagination justify-content-center">
                    <ReactPaginate
                        forcePage={currentPage}
                        breakLabel="..."
                        nextLabel={<span dangerouslySetInnerHTML={{ __html: "<img src='" + iconCR + "'style='width: 20px; height: 20px;' />" }} />}
                        onPageChange={handlePageChange}
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
            <ModalDuAnCreateNv idda={selectedItemIdDA} show={showModalCreate} handleClose={handleCloseModal3}/>
            <ModalDetailDuAnNV idda={selectedItemIdDA} show={showModalDetail} handleClose={handleCloseModaldetail}/>
            <ModalDADelete idda={selectedItemIdDA} show={showModalDelete} handleClose={handleCloseModaldelete} Delete={Delete} />
            <ModalCreateDA show={showModalCreateNew} handleClose={handleCloseModalCreateNew} fetchDuAn={fetchDuAn}/>
            <ModalUpdateDA idda={selectedItemIdDA} show={showModalEdit} handleClose={handleCloseModalUpdate} fetchDuAn={fetchDuAn}/>

        </div>
    );
};

export default DuAnList;
