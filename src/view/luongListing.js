import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

const LuongList = () => {
    const [luongData, setLuongData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [size, setSize] = useState(5);

    useEffect(() => {
        fetchLuongData();
    }, [currentPage]); // Gọi fetchLuongData mỗi khi currentPage thay đổi

    const fetchLuongData = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/v1/luong/get-all?pageNumber=${currentPage}&pageSize=${size}`);
            if (!response.ok) {
                throw new Error('Failed to fetch luong data');
            }
            const data = await response.json();
            setLuongData(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching luong data:', error);
            // Xử lý lỗi ở đây nếu cần thiết
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className="container">
            <div className="card">
                <h2 className="card-title">Quản lý lương</h2>

                <div className="row" style={{ display: "flex", marginBottom: "20px" }}>
                    <div className="col-2">
                        <button className="btn btn-success">Thêm mới</button>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>STT</th>
                                <th>Tên loại lương</th>
                                <th>Mức lương</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {luongData.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.theloai}</td>
                                    <td>{item.mucluong}</td>
                                    <td>{item.ngaybatdau}</td>
                                    <td>{item.ngayketthuc}</td>
                                    <td>{item.trangThai ? 'Hoạt động' : 'Ngưng hoạt động'}</td>
                                    <td>
                                        <button className="btn btn-info">Sửa</button>
                                        <button className="btn btn-danger">Xóa</button>
                                        <button className="btn btn-warning">Chi tiết</button>
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
                        nextLabel="next >"
                        onPageChange={handlePageChange}
                        pageRangeDisplayed={2}
                        pageCount={totalPages}
                        previousLabel="< previous"
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
        </div>
    );
};

export default LuongList;
