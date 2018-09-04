from PIL import Image

import os, sys

path = "./routes/profile-pictures/"
dirs = os.listdir( path )

def resize():
    for item in dirs:
        if os.path.isfile(path+item):
            im = Image.open(path+item)
            if(im.size == (300,300)):
                print("right size")
            else:
                f, e = os.path.splitext(path+item)
                imResize = im.resize((300,300), Image.ANTIALIAS)
                imResize.save(f + '.png', 'PNG', quality=90)
                width, height = im.size
                print(im.size);

resize()
