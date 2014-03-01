duplo
=====

image library de-duper.

# Purpose

To be able to import images from many sources and still contain them easily in the same directory, even if there are occasional name collisions.

Currently only searches duplicates where filenames collide.

Method:

- index all the photos in the current directory and its subdirectories by filename
    - for colliding filenames, find out if they are the duplicates:
        - if duplicate: remove all but one
        - not duplicate: rename file(s) to avoid collisions

Nothing is altered, only actions suggested.


# Example

./test is a directory with the following structure:

        test
        ├── import-1
        │   ├── img1.jpg
        │   └── img2.jpg
        ├── import-2
        │   ├── img1.jpg
        │   └── img3.jpg
        └── import-3
            └── img2.jpg

import-1/img1.jpg and import-2/img1.jpg are the same file.
import-1/img2.jpg and import-3/img2.jpg are different files, despite the file name.
import-2/img3.jpg and import-3/img2.jpg are the same file, despite the file name.

Sample run:

    $ node duplo test

    Scanning test...
       import-1/
       import-2/
       import-3/
    Scanning done.
    img2.jpg (2 matches)
       test/import-3/img2.jpg md5=b1f8546c0bb13e1bda64c7795d7c7d5b
       test/import-1/img2.jpg md5=f467567c76296dd0c204d9bccafc7bc0
    img1.jpg (2 matches)
       test/import-2/img1.jpg md5=8f26b488cc2092d3c365e6627d22c19e
       test/import-1/img1.jpg md5=8f26b488cc2092d3c365e6627d22c19e

    These files have copies and should be safe to delete:
    test/import-1/img1.jpg

    These files should be renamed:
    test/import-1/img2.jpg -> test/import-1/img2-99d1.jpg


To summarize: *Dupes are detected only if they share their filename.*


# Todo

- use perceptual hashing / hamming distance for detecting dupes:
    https://github.com/aaronm67/node-phash

# License

MIT

