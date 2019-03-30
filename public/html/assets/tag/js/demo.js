$(function () {
	var userlist = [{
			userId: "H1000",
			userName: "张三"
		},
		{
			userId: "H2000",
			userName: "李四"
		},
		{
			userId: "H3000",
			userName: "王五"
		},
		{
			userId: "H4000",
			userName: "陈六"
		},
	];
	var tag_data = [];
	for (var i = 1; i <= userlist.length; i++) {
		var pid = userlist[i - 1].userId;
		var pname = userlist[i - 1].userName;
		var piname = pname + '-' + pid;
		var plist = {
		};
		tag_data.push(plist);
	}
	$('#selectPage').bSelectPage({
		showField: 'piname',
		keyField: 'i',
		data: tag_data,
		multiple: true,
	});
});