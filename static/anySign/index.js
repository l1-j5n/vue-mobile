
var DATA_CANNOT_PARSED = "10003"; //输入数据项无法解析
var SERVICE_SYSTEM_EXCEPTION = "10011"; //服务系统异常错误
var RECOGNITION_RESULT_EMPTY = "10100"; //识别结果为空
var CONNECTION_SERVICE_TIMEOUT = "10101"; //连接识别服务超时
var CONNECTION_RECOGNITION_EXCEPTION = "10102"; //连接识别服务异常
var SUCCESS = "0"; //识别成功
var RECOGNITION_FALSE = "-1";//识别错误

// options至少会有的项有： keyword, certNo, name, id
var commitSign = function(options, callback) {
  EncAlgType.EncAlg = "RSA";
  var channel = 999999;
  var businessId = (options.id || 0).toString(); //集成信手书业务的唯一标识
  var contextId = 30;
  var instance = new AnySignApi();
  instance.initAnySignApi(function (contextId, contextType, value) {
    if (contextType === CALLBACK_TYPE_COMMENTSIGN) {
      if (typeof callback === 'function') {
        callback(value)
      }
    }
    return null
  }, channel);

  var signer = new Signer(options.name || "签名人", options.certNo || Date.now().toString());

  /**
   * 根据坐标定位签名方式
   * @param left 签名图片最左边坐标值，相对于PDF当页最左下角(0,0)点，向上和向右分别为X轴、Y轴正方向
   * @param top 签名图片顶边坐标值，相对于PDF当页最左下角(0,0)点，向上和向右分别为X轴、Y轴正方向
   * @param right 签名图片最右边坐标值，相对于PDF当页最左下角(0,0)点，向上和向右分别为X轴、Y轴正方向
   * @param bottom 签名图片底边坐标值，相对于PDF当页最左下角(0,0)点，向上和向右分别为X轴、Y轴正方向
   * @param pageNo 签名在PDF中的页码，从1开始
   * @param unit 坐标系单位，目前支持"dp"和"pt"
   * @constructor
   */
  var signerRule = new SignRule_XYZ(84.0, 523.0, 400.0, 477.0, 1, "dp");


  /**
   * 关键字定位方式，寻找PDF中的关键字，根据关键字位置放置签名图片
   * @param keyword 关键字
   * @param keyWordAlignMethod 签字图片和关键字位置关系：等于1时，签字图片和关键字矩形重心重合
   *                           等于2时，签字图片位于关键字正下方，中心线对齐；等于3时，签字图片位于关键字正右方，中心线对齐；
   *                            等于4时，签字图片左上角和关键字右下角重合，可能额外附加偏移量，详见构造函数的offset参数
   * @param keyWordOffset 当keyWordAlignMethod非零时，额外附加的偏移量，单位pt
   * @param pageNo 寻找关键字的PDF起始页码
   * @param KWIndex KWIndex 第几个关键字
   * @constructor
   */
    //              var signerRule = new SignRule_KeyWord("默认",4,0,1,1);


  var commentConfig = new CommentConfig(signer, signerRule);
  commentConfig.commitment = options.keyword;
  commentConfig.mass_word_height = 50;
  commentConfig.mass_word_width = 50;
  commentConfig.mass_words_in_single_line = 20;
  commentConfig.penColor = "#000";
  commentConfig.nessesary = false;
  commentConfig.isdistinguish = false;
  commentConfig.mass_dlg_type = CommentInputType.WhiteBoard;
  instance.addCommentObj(contextId, commentConfig);
  instance.commitConfig();


  var formData = "PGh0bWw+PGhlYWQ+PHRpdGxlPjwvdGl0bGU+PG1ldGEgaHR0cC1lcXVpdj0nQ29udGVudC1UeXBlJyBjb250ZW50PSd0ZXh0L2h0bWw7IGNoYXJzZXQ9VVRGLTgnIC8+PC9oZWFkPjxib2R5PjxkaXY+PGRpdj48bGFiZWw+a2V5d29yZDo8L2xhYmVsPjwvZGl2PjxkaXY+PGxhYmVsPuWIl+WQjTLvvJo8L2xhYmVsPjwvZGl2PjxkaXY+PGxhYmVsPuWIl+WQjTPvvJo8L2xhYmVsPjwvZGl2PjwvZGl2PjwvYm9keT48L2h0bWw+";

  var templateSerial = "4000";//用于生成PDF的模板ID
  instance.setTemplate(TemplateType.HTML, formData, businessId, templateSerial);
  switch (instance.showCommentDialog(contextId)) {
    case RESULT_OK:
      break;
    case EC_API_NOT_INITED:
      alert("信手书接口没有初始化");
      break;
    case EC_WRONG_CONTEXT_ID:
      alert("没有配置相应context_id的签字对象");
      break;
    case EC_COMMENT_ALREADY_SHOW:
      alert("批注签名框已弹出，请勿重复操作！");
  }
};

