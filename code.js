// Hiển thị bảng UI
figma.showUI(__html__, { width: 240, height: 180 });

figma.ui.onmessage = msg => {
  if (msg.type === 'apply-perfect-pixel') {
    const multiple = msg.multiple;
    const selection = figma.currentPage.selection;

    // Kiểm tra xem đã chọn gì chưa
    if (selection.length === 0) {
      figma.notify("Vui lòng chọn ít nhất 1 frame hoặc phần tử trên màn hình!");
      return;
    }

    // Công thức tính toán làm tròn
    const roundToMultiple = (num, m) => Math.round(num / m) * m;

    // ĐÂY LÀ PHẦN MỚI: Cỗ máy đệ quy "chui" vào từng ngóc ngách
    function processNode(node) {
      try { // Dùng try-catch để lỡ đụng trúng các frame bị khóa (lock) thì plugin không bị treo
        
        // Làm tròn vị trí (X, Y)
        if ('x' in node && 'y' in node) {
          node.x = roundToMultiple(node.x, multiple);
          node.y = roundToMultiple(node.y, multiple);
        }
        
        // Làm tròn kích thước (Width, Height)
        if ('resize' in node) {
          let newWidth = roundToMultiple(node.width, multiple);
          let newHeight = roundToMultiple(node.height, multiple);
          
          if (newWidth === 0) newWidth = multiple;
          if (newHeight === 0) newHeight = multiple;

          node.resize(newWidth, newHeight);
        }
      } catch (error) {
        // Nếu có frame con nào không cho phép sửa (ví dụ: nằm trong Component), ta cứ âm thầm bỏ qua
      }

      // NẾU CÓ FRAME CON BÊN TRONG, TIẾP TỤC ĐÀO SÂU VÀO
      if ('children' in node) {
        for (const child of node.children) {
          processNode(child); // Tự gọi lại chính nó để xử lý frame con
        }
      }
    }

    // Bắt đầu chạy cỗ máy cho các frame bạn đang bôi đen
    for (const selectedNode of selection) {
      processNode(selectedNode);
    }
    
    // Báo thành công!
    figma.notify(`Đã làm tròn từ cha tới con theo bội số ${multiple}!`);
  }
};