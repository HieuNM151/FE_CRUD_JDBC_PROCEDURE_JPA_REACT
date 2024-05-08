import React from "react";

const ExportExcelButton = () => {
    const downloadExcel = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/v1/nhan-vien/export-to-excel');
            const blob = await response.blob();

            const fileURL = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', 'danh_sach_nhan_vien.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    return (
        <button className="btn btn-outline-info" onClick={downloadExcel}>Export to Excel</button>
    );
}

export default ExportExcelButton;