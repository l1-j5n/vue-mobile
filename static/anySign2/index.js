
var DATA_CANNOT_PARSED = "10003"; //输入数据项无法解析
var SERVICE_SYSTEM_EXCEPTION = "10011"; //服务系统异常错误
var RECOGNITION_RESULT_EMPTY = "10100"; //识别结果为空
var CONNECTION_SERVICE_TIMEOUT = "10101"; //连接识别服务超时
var CONNECTION_RECOGNITION_EXCEPTION = "10102"; //连接识别服务异常
var SUCCESS = "0"; //识别成功
var RECOGNITION_FALSE = "-1";//识别错误

var apiInstance;

/**
 *
 * @param options Object
 * options: {
 *  certNo
 *  name
 *  keyword
 *  alignMethod
 *  xOffset (xOffest)
 *  singleWidth?
 *  singleHeight?
 * }
 * @param callback Function
 */
function baseSign(options, callback) {
    options = options || {}

    var channel = 999999; //渠道号，由信手书提供，请咨询项目经理
    var contextId = 20;

    //设置签名算法，默认为RSA，可以设置成SM2
    EncAlgType.EncAlg = "SM2";

    apiInstance = new AnySignApi();

    //初始化签名接口
    apiInstance.initAnySignApi(function (contextId, contextType, value) {

        value = 'data:image/png;base64,' + value;

        if (contextType === CALLBACK_TYPE_SIGNATURE) {

            var gem = apiInstance.getUploadDataGram();
            var result = {value: value, gem: gem};
            if (typeof callback === 'function') {
                callback(result)
            }
        }
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
    // var signerRule = new SignRule_XYZ(100.0, 110.1, 180.2, 50.3, 1, "pt");

    /**
     * 关键字定位方式，寻找PDF中的关键字，根据关键字位置放置签名图片
     * @param keyword 关键字
     * @param keyWordAlignMethod 签字图片和关键字位置关系：等于1时，签字图片和关键字矩形重心重合
     *                            等于2时，签字图片位于关键字正下方，中心线对齐；等于3时，签字图片位于关键字正右方，中心线对齐；
     *                            等于4时，签字图片左上角和关键字右下角重合，可能额外附加偏移量，详见构造函数的offset参数
     * @param keyWordOffset 当keyWordAlignMethod非零时，额外附加的偏移量，单位pt
     * @param pageNo 寻找关键字的PDF起始页码
     * @param KWIndex KWIndex 第几个关键字
     * @constructor
     */
    var signerRule = new SignRule_KeyWord(options.keyword, options.alignMethod, options.xOffset||options.xOffest, 1,1);
    //var signerRule = new SignRule_KeyWordV2("签名算法",50,0,1,1);

    /**
     *根据关键字定位签名位置
     * @param keyWord 关键字字面值
     * @param xOffset X轴偏移量，适配关键字和规则
     * @param yOffset Y轴偏移量，适配关键字和规则
     * @param pageNo 签名在PDF中的页码，第几页查找关键字，正数为正序，当是负数为倒序
     * @param KWIndex KWIndex 第几个关键字
     * @constructor
     */
//                var signerRule = new SignRule_KeyWord("签名算法",100,100,1,1);

    /**
     * 关键字定位方式，寻找PDF中的关键字，根据关键字位置放置签名图片
     * @param keyword 关键字
     * @param keyWordAlignMethod 签字图片和关键字位置关系：等于0时，签字图片和关键字矩形重心重合
     *                            等于1时，签字图片位于关键字正下方，中心线对齐；等于2时，签字图片位于关键字正右方，中心线对齐；
     *                            等于3时，签字图片左上角和关键字右下角重合，可能额外附加偏移量，详见构造函数的offset参数
     * @param keyWordOffset 当keyWordAlignMethod非零时，额外附加的偏移量，单位pt
     * @param pageNo 寻找关键字的PDF起始页码
     * @param KWIndex KWIndex 第几个关键字
     * @constructor
     */
   //  var signerRule = new SignRule_KeyWordV2(options.keyword, options.alignMethod, options.xOffset, 1,1);

    var signatureConfig = new SignatureConfig(signer, signerRule);
    // signatureConfig.timeTag = new TimeTag(1, "yyMMdd hh:mm;ss"); // 1:时间在上、2：时间在下、3：时间在右;
    signatureConfig.singleWidth = options.singleWidth || 200;
    signatureConfig.singleHeight = options.singleHeight || 200;
    signatureConfig.title = options.keyword;
    signatureConfig.titleSpanFromOffset = 10;//当为普通签名时有效，表示title中需要放大显示字体的数组起始index
    signatureConfig.titleSpanToOffset = 10;//当为普通签名时有效，表示title中需要放大显示字体的数组结束index
    signatureConfig.penColor = "#000000";
    signatureConfig.isTSS = false; //是否开始时间戳服务
    signatureConfig.signatureImgRatio = 3.0;
    signatureConfig.nessesary = true;
    signatureConfig.isdistinguish = false;
    apiInstance.addSignatureObj(contextId, signatureConfig);

    apiInstance.commitConfig();

    var formData = "PGh0bWw+PGhlYWQ+PHRpdGxlPjwvdGl0bGU+PG1ldGEgaHR0cC1lcXVpdj0nQ29udGVudC1UeXBlJyBjb250ZW50PSd0ZXh0L2h0bWw7IGNoYXJzZXQ9VVRGLTgnIC8+PC9oZWFkPjxib2R5PjxkaXY+PGRpdj48bGFiZWw+a2V5d29yZDo8L2xhYmVsPjwvZGl2PjxkaXY+PGxhYmVsPuWIl+WQjTLvvJo8L2xhYmVsPjwvZGl2PjxkaXY+PGxhYmVsPuWIl+WQjTPvvJo8L2xhYmVsPjwvZGl2PjwvZGl2PjwvYm9keT48L2h0bWw+";
    var businessId = (options.id || 0).toString();//集成信手书业务的唯一标识
    var template_serial = "4000";//用于生成PDF的模板ID

    //配置JSON格式签名原文
    /**
     * 设置表单数据，每次业务都需要set一次
     * @param template_type 签名所用的模板类型
     * @param contentUtf8Str 表单数据，类型为Utf8字符串
     * @param businessId 业务工单号
     * @param template_serial 模板序列号
     * @returns {*} 是否设置成功
     */
    apiInstance.setTemplate(TemplateType.HTML, formData, businessId, template_serial);

    switch (apiInstance.showSignatureDialog(contextId)) {
        case RESULT_OK:
            break;
        case EC_API_NOT_INITED:
            alert("信手书接口没有初始化");
            break;
        case EC_WRONG_CONTEXT_ID:
            alert("没有配置相应context_id的签字对象");
            break;
    }

}
