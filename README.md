# QUẢN LÝ LỚP HỌC 10A8-MS JENNY

Ứng dụng Sổ Chủ Nhiệm Điện Tử Thông Minh dành riêng cho Giáo viên Chủ nhiệm **Ms Jenny - Lớp 10A8**.

## 🌟 Tính Năng Nổi Bật

1. **Kết nối Cơ sở dữ liệu trực tuyến Google Sheets / Google Drive**:
   - Tự động nhận diện và đồng bộ danh sách học sinh từ link Google Sheets công khai.
   - Hỗ trợ kết nối Google Apps Script Web App để đọc & cập nhật 2 chiều.
   - Lưu trữ dữ liệu Offline trên LocalStorage, tự động làm mới theo chu kỳ (Auto Sync).
   - Tích hợp sẵn template mẫu danh sách học sinh lớp 10A8 chuẩn Bộ Giáo dục & Đào tạo.
2. **Quản lý Hồ sơ học sinh 5 chiều**:
   - Lý lịch cơ bản, thông tin phụ huynh, hoàn cảnh gia đình, tâm sinh lý & năng khiếu, sức khỏe & y tế.
3. **Chuyên cần & Nề nếp thi đua 1-chạm**:
   - Điểm danh buổi Sáng / Chiều tức thì, ghi nhận khen thưởng / vi phạm, xếp hạng thi đua 4 Tổ.
4. **Sổ điểm & Đánh giá học tập**:
   - Nhập điểm 10 môn học, tự động tính ĐTB theo Thông tư 22/2021/TT-BGDĐT, trợ lý gợi ý lời phê học bạ.
5. **Liên lạc Phụ huynh đa kênh**:
   - Soạn thông báo toàn lớp, gửi tin nhắn riêng, lịch hẹn tiếp phụ huynh (trực tiếp / Google Meet).
6. **Lịch công tác & Sổ nhắc việc**:
   - Quản lý thời khóa biểu, lịch họp tổ chuyên môn, to-do list công tác chủ nhiệm.
7. **Báo cáo thống kê định kỳ chuẩn Bộ GD&ĐT**:
   - Sơ kết tuần/tháng/học kỳ, bản in A4 tiêu chuẩn và xuất file Excel (.csv / .xlsx).

## 🚀 Hướng Dẫn Chạy Cục Bộ (Local)

1. Cài đặt các gói phụ thuộc:
   ```bash
   bun install # hoặc npm install
   ```
2. Chạy ứng dụng ở chế độ phát triển:
   ```bash
   bun run dev # hoặc npm run dev
   ```
3. Mở trình duyệt tại địa chỉ `http://localhost:3000`.

## ☁️ Triển khai lên Vercel

Ứng dụng đã được cấu hình sẵn tệp `vercel.json` hỗ trợ SPA Routing. Bạn chỉ cần liên kết repository với tài khoản Vercel và nhấn Deploy.
