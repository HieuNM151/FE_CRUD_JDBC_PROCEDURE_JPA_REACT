import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const EmpDetail = () => {
    const { idnv } = useParams();

    const [emplData, setEmplData] = useState(null);

    useEffect(() => {
        if (idnv && idnv.trim() !== "") { // Kiểm tra idnv không phải null hoặc chuỗi rỗng
            fetch(`http://localhost:8081/api/v1/nhan-vien/details?id=${idnv}`)
                .then((res) => res.json())
                .then((resp) => {
                    setEmplData(resp);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    }, [idnv]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    return (
        <div>
            {emplData && (
                <div>
                    <h1>Detail</h1>
                    <h5>Họ và Tên: {emplData.name}</h5>
                    <h5>Ngày/ tháng/ năm sinh: {formatDate(emplData.namsinh)}</h5>
                    <h5>Sđt: {emplData.sdt}</h5>
                    <h5>Giới tính: {emplData.gioitinh ? "Nam" : "Nữ"}</h5>
                    {emplData.diachi && (
                        <div>
                            <h5>Quận-Huyện: {emplData.diachi.huyen}</h5>
                            <h5>Phường-Xã: {emplData.diachi.xa}</h5>
                            <h5>Tỉnh: {emplData.diachi.tinh}</h5>
                        </div>
                    )}
                    <Link className="btn btn-warning" to="/">Quay lại</Link>
                </div>
            )}
        </div>
    );
}

export default EmpDetail;
