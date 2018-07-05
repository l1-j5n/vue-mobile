#关于CA签名

组件r-gather 展示签名结果，它把签名的采集委托给了 r-sign

组件r-sign 在app内时使用native的功能完成签名、批注，人脸识别等的采集，在h5中使用了UploadService完成图片上传等功能。

#关于资料上传

组件 r-gather-multiple 在app内部使用了native提供的多图上传，在h5中使用了UploadService完成图片上传
