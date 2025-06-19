#!/usr/bin/env python3
# Simple script to create basic PNG icons
import struct

def create_minimal_png(width, height, color=(17, 24, 39)):
    """Create a minimal PNG with solid color"""
    def crc32(data):
        crc = 0xFFFFFFFF
        for byte in data:
            crc ^= byte
            for _ in range(8):
                if crc & 1:
                    crc = (crc >> 1) ^ 0xEDB88320
                else:
                    crc >>= 1
        return crc ^ 0xFFFFFFFF
    
    # PNG signature
    png_signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = crc32(b'IHDR' + ihdr_data)
    ihdr_chunk = struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT chunk with minimal scanline data
    scanline = bytes([0] + list(color) * width)  # Filter byte + RGB pixels
    idat_raw = b''.join([scanline] * height)
    
    # Simple compression (we'll use uncompressed blocks)
    import zlib
    idat_compressed = zlib.compress(idat_raw)
    idat_crc = crc32(b'IDAT' + idat_compressed)
    idat_chunk = struct.pack('>I', len(idat_compressed)) + b'IDAT' + idat_compressed + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = crc32(b'IEND')
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    return png_signature + ihdr_chunk + idat_chunk + iend_chunk

# Create icons
for size in [16, 48, 128]:
    png_data = create_minimal_png(size, size)
    with open(f'icon{size}.png', 'wb') as f:
        f.write(png_data)
    print(f'Created icon{size}.png')