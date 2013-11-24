duplo
=====

image library de-duper.

# Purpose

To be able to import images from many sources and still contain them easily in the same directory, even if there are occasional name collisions.

Initially only searches duplicates where filenames collide.

Method:

- index all the photos in the current directory and its subdirectories by filename
    - for colliding filenames, find out if they are the duplicates:
        - if duplicate: remove all but one
        - not duplicate: rename file(s) to avoid collisions

# Todo

- use perceptual hashing / hamming distance for detecting dupes:
    https://github.com/aaronm67/node-phash