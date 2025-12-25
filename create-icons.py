from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size):
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw gradient background (rounded rectangle)
    padding = size // 10
    radius = size // 4
    
    # Create gradient effect with multiple rectangles
    for i in range(padding, size - padding):
        # Calculate color gradient from purple to pink
        progress = (i - padding) / (size - 2 * padding)
        r = int(102 + (240 - 102) * progress)
        g = int(126 + (147 - 126) * progress)
        b = int(234 + (251 - 234) * progress)
        
        draw.rectangle(
            [i, padding, i+1, size - padding],
            fill=(r, g, b, 255)
        )
    
    # Draw rounded corners (approximate)
    for x in range(padding):
        for y in range(padding):
            if (x - padding)**2 + (y - padding)**2 > radius**2:
                img.putpixel((x, y), (0, 0, 0, 0))
            if (size - x - padding)**2 + (y - padding)**2 > radius**2:
                img.putpixel((size - x - 1, y), (0, 0, 0, 0))
            if (x - padding)**2 + (size - y - padding)**2 > radius**2:
                img.putpixel((x, size - y - 1), (0, 0, 0, 0))
            if (size - x - padding)**2 + (size - y - padding)**2 > radius**2:
                img.putpixel((size - x - 1, size - y - 1), (0, 0, 0, 0))
    
    # Draw wallet icon in white
    wallet_width = size // 2
    wallet_height = size // 3
    wallet_x = (size - wallet_width) // 2
    wallet_y = (size - wallet_height) // 2
    
    # Wallet body
    draw.rounded_rectangle(
        [wallet_x, wallet_y, wallet_x + wallet_width, wallet_y + wallet_height],
        radius=size // 20,
        fill=(255, 255, 255, 240)
    )
    
    # Wallet flap (top part)
    draw.rectangle(
        [wallet_x, wallet_y, wallet_x + wallet_width, wallet_y + wallet_height // 3],
        fill=(255, 255, 255, 180)
    )
    
    # Card slot line
    line_y = wallet_y + wallet_height // 2
    draw.line(
        [wallet_x + wallet_width // 4, line_y, wallet_x + 3 * wallet_width // 4, line_y],
        fill=(102, 126, 234, 255),
        width=max(1, size // 40)
    )
    
    # Add shine effect
    shine_size = size // 8
    draw.ellipse(
        [wallet_x - shine_size // 2, wallet_y - shine_size // 2, 
         wallet_x + shine_size // 2, wallet_y + shine_size // 2],
        fill=(255, 255, 255, 100)
    )
    
    return img

# Create icons directory
icons_dir = os.path.join('public', 'icons')
os.makedirs(icons_dir, exist_ok=True)

# Generate icons in different sizes
sizes = [16, 32, 48, 128]
for size in sizes:
    icon = create_icon(size)
    icon.save(os.path.join(icons_dir, f'icon{size}.png'), 'PNG')
    print(f'✓ Created icon{size}.png')

print('\n✅ All PNG icons created successfully!')
