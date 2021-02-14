# irender

    A light-weight and fast  2d rendering to render image\canvas on canavs based on webgl. 


### position rotation and scale

    The position and origin of rotation\scale  is center of the element, thus when you set rotation\scale, the position will not change, and it always indicate the center of the element.

### color

    When the content of image/canvas is white, you  have a chance to set the color of the content.
    Color is flowing rgba format, red\green\blue is ranged 0 from  255 but alpha is ranged 0 from 1.

### zIndex

    In fact the order of rendering is according to elemnt.elementIndex, any element zIndex is changed, all the  elemnt.elementIndex will reset before  redering. 

### background color

    Do not set background color on canvas, it may cause strange border around opacity element.
    Please use creating a large element instaead.
