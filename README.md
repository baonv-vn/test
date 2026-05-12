# Daily System (Expo React Native)

Ứng dụng được refactor theo kiến trúc timeline-driven cho hệ thống sinh hoạt hằng ngày.

## Tính năng chính

- Timeline hằng ngày theo khung giờ (`workout`, `cooking`, `study`, `rest`)
- Tự động kích hoạt tác vụ theo thời gian hiện tại
- View Mode mặc định tại Home (timeline)
- Edit Mode trong Settings để CRUD:
  - Lịch trình
  - Workout routines
  - Cooking recipes
- Lưu dữ liệu cục bộ bằng Zustand + AsyncStorage
- UI tiếng Việt

## Cấu trúc thư mục

- `src/screens`
- `src/components`
- `src/store`
- `src/modules/workout`
- `src/modules/cooking`
- `src/modules/timeline`

## Chạy dự án

```bash
npm install
npm start
```
