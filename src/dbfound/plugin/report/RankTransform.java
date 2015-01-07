package dbfound.plugin.report;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.nfwork.dbfound.model.ModelEngine;
import com.nfwork.dbfound.model.base.JavaSupport;
import com.nfwork.dbfound.util.JsonUtil;
import com.nfwork.dbfound.web.WebWriter;

@SuppressWarnings("unchecked")
public class RankTransform extends JavaSupport {

	@Override
	public void execute(){
		context.isExport = true;

		String modelName = context.getCurrentModel();
		String rowColumnName = params.get("rowColumnName").getStringValue();
		String columnColumnName = params.get("columnColumnName")
				.getStringValue();
		String keyColumnName = params.get("keyColumnName").getStringValue();

		List<Map> datas = ModelEngine.query(context, modelName, null)
				.getDatas();

		List<String> rows = new ArrayList<String>();
		Map<String, Integer> rowsMap = new HashMap<String, Integer>();

		Map<String, Integer> columnsMap = new HashMap<String, Integer>();
		List<Column> columns = new ArrayList<Column>();

		Map<String, Object> bufferDatas = new HashMap<String, Object>();

		// 得到行名 列名 缓存数据
		for (Map map : datas) {
			String row = map.get(rowColumnName).toString();
			if (rowsMap.get(row) == null) {
				rows.add(row);
				rowsMap.put(row, 1);
			}

			String javaName = map.get(columnColumnName).toString();
			if (columnsMap.get(javaName) == null) {
				Column column = new Column();
				column.jsName = "c" + (columns.size() + 1);
				column.javaName = javaName;
				columnsMap.put(javaName, 1);
				columns.add(column);
			}

			bufferDatas.put(row + javaName, map.get(keyColumnName));
		}

		// 重新装载数据
		List<Map> newDatas = new ArrayList<Map>();
		for (String row : rows) {
			Map newData = new HashMap();
			newData.put("c", row);
			newDatas.add(newData);
			for (Column column : columns) {
				Object value = getValue(bufferDatas, row, column.javaName);
				newData.put(column.jsName, value);
			}
		}

		context.outMessage = false;
		ReportResponseObject object = new ReportResponseObject();
		object.setSuccess(true);
		object.setDatas(newDatas);
		object.setTotalCounts(newDatas.size());
		object.setColumns(columns);
		WebWriter.jsonWriter(context.response, JsonUtil.beanToJson(object));
	}

	private Object getValue(Map<String, Object> datas, String row, String column) {
		return datas.get(row + column);
	}
}
