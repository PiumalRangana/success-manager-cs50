def hex_to_rgb(hex_color):
    """Convert a hex color string to an RGB tuple."""
    hex_color = hex_color.lstrip('#')
    lv = len(hex_color)
    return tuple(int(hex_color[i:i + lv // 3], 16) for i in range(0, lv, lv // 3))

def task_text_color(task_color):
    """Determine appropriate text color (black or white) based on task background color."""
    r, g, b = hex_to_rgb(task_color)
    # Calculate luminance
    luminance = (0.299 * r + 0.587 * g + 0.114 * b)
    return '#000000' if luminance > 186 else '#FFFFFF'

__all__ = [
    'task_text_color'
]

