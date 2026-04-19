// Hiển thị cái bảng UI mà chúng ta vừa tạo ở file html
figma.showUI(__html__, { width: 240, height: 180 });

// Lắng nghe khi bạn bấm nút "Áp Dụng"
figma.ui.onmessage = msg => {
  if (msg.type === 'apply-perfect-pixel') {
    const multiple = msg.multiple;
    const selection = figma.currentPage.selection;

    // Kiểm tra xem bạn đã chọn frame nào chưa
    if (selection.length === 0) {
      figma.notify("Vui lòng chọn ít nhất 1 frame hoặc phần tử trên màn hình!");
      return;
    }

    // Công thức tính toán làm tròn theo bội số
    const roundToMultiple = (num, m) => Math.round(num / m) * m;

    // Chạy vòng lặp qua tất cả các frame bạn đang chọn
    for (const node of selection) {
      
      // Làm tròn vị trí (X, Y)
      if ('x' in node && 'y' in node) {
        node.x = roundToMultiple(node.x, multiple);
        node.y = roundToMultiple(node.y, multiple);
      }
      
      // Làm tròn kích thước (Width, Height)
      if ('resize' in node) {
        // Đảm bảo kích thước không bị bằng 0
        let newWidth = roundToMultiple(node.width, multiple);
        let newHeight = roundToMultiple(node.height, multiple);
        
        if (newWidth === 0) newWidth = multiple;
        if (newHeight === 0) newHeight = multiple;

        node.resize(newWidth, newHeight);
      }
    }
    
    // Báo thành công!
    figma.notify(`Đã làm tròn hoàn hảo theo bội số ${multiple}!`);
  }
};