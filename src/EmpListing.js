import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmpListing = () => {
    const [emplData, setEmplData] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchInput, setSearchInput] = useState('');
    const [gender, setGender] = useState('');
    const [dateForm, setDateForm] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [refreshFlag, setRefreshFlag] = useState(false); // Thêm refreshFlag
    const navigate = useNavigate();

    const LoadDetail = (id) => {
        navigate("/employee/detail/" + id);
    };

    const LoadEdit = (id) => {
        navigate("/employee/edit/" + id);
    };

    const RemoveFunction = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            fetch(`http://localhost:8081/api/v1/nhan-vien/delete/${id}`, {
                method: "DELETE"
            })
                .then(response => {
                    if (response.ok) {
                        console.log("Xóa thành công");
                        toast.success("Xóa thành công");
                        handleSearch();
                    } else {
                        console.error("Xóa thất bại");
                        toast.error("Xóa thất bại");
                    }
                })
                .catch(error => {
                    console.error("Đã xảy ra lỗi khi cập nhật nhân viên:", error);
                });
        }
    };

    const handleSearch = () => {
        const requestData = {
            name: searchInput,
            gioitinh: gender,
            ngayBatDau: dateForm,
            ngayKetThuc: dateTo,
            page: pageNumber - 1,
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
                if (resp.length === 0 && pageNumber > 1) {
                    setPageNumber(pageNumber - 1);
                    toast.success("Thực hiện tìm kiếm thành công và trở lại trang 1");
                } else {
                    setEmplData(resp);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const handleRefresh = () => { // Thêm hàm xử lý làm mới
        setSearchInput('');
        setGender('');
        setDateForm('');
        setDateTo('');
        setPageNumber(1);
        setRefreshFlag(true); // Đặt refreshFlag thành true
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    useEffect(() => {
        handleSearch();
    }, [pageNumber, pageSize, searchInput, gender, dateForm, dateTo, refreshFlag]);

    useEffect(() => {
        if (refreshFlag) {
            toast.success('Làm mới thành công'); // Hiển thị thông báo khi làm mới thành công
            setRefreshFlag(false); // Đặt lại refreshFlag để tránh hiển thị thông báo liên tục
        }
    }, [refreshFlag]);

    return (
        <div className="container">
            <div className="card">
                <h2 className="card-title">EmpListing</h2>

                <div className="row" style={{ display: "flex", marginBottom: "20px" }}>
                    <div className="col-4">
                        <input
                            className="form-control"
                            placeholder="Tìm theo Tên, SĐT"
                            style={{ marginTop: "4px", marginLeft: "20px" }}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                    <div className="col-4 d-flex justify-content-start">
                        <button className="btn btn-warning" onClick={handleRefresh}> {/* Thay đổi onClick */}
                            Làm mới
                        </button>
                    </div>
                    <div className="col-2 d-flex justify-content-start" >
                        <label className="form-label" style={{ marginTop: "11px" }}>Giới tính :</label>
                        <select style={{ color: "green", border: "none" }} className="custom-select"
                            value={gender}
                            onChange={(e) => { setGender(e.target.value); setPageNumber(1) }}>
                            <option value="">Tất cả</option>
                            <option value="1">Nam</option>
                            <option value="0">Nữ</option>
                        </select>
                    </div>
                    <div className="col-2">
                        <Link to="employee/create" className="btn btn-success">Thêm mới</Link>
                    </div>
                </div>
                <div className="row" style={{ marginBottom: "20px", marginLeft: "20px" }}>
                    <div className="col-lg-3 mb-3">
                        <div className="from-group">
                            <label className="fw-bold">Tìm kiếm theo ngày từ:</label>
                            <input value={dateForm} onChange={(e) => setDateForm(e.target.value)} className="form-control" type="date"></input>
                        </div>
                    </div>
                    <div className="col-lg-3 mb-3">
                        <div className="from-group">
                            <label className="fw-bold">Đến ngày:</label>
                            <input value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPageNumber(1); }} className="form-control" type="date"></input>
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
                                        <button onClick={() => LoadEdit(item.id)} className="btn btn-info">Sửa</button>
                                        <button onClick={() => RemoveFunction(item.id)} className="btn btn-danger">Xóa</button>
                                        <button onClick={() => LoadDetail(item.id)} className="btn btn-warning">Chi tiết</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="pagination justify-content-center">
                    <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1}>Previous</button>
                    <span>{pageNumber}</span>
                    <button onClick={() => setPageNumber(pageNumber + 1)} disabled={emplData.length < pageSize}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default EmpListing;
