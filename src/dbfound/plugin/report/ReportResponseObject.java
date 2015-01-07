package dbfound.plugin.report;

import java.util.ArrayList;
import java.util.List;

import com.nfwork.dbfound.dto.QueryResponseObject;

public class ReportResponseObject extends QueryResponseObject {

	private List<Column> columns = new ArrayList<Column>();

	public List<Column> getColumns() {
		return columns;
	}

	public void setColumns(List<Column> columns) {
		this.columns = columns;
	}
	
	
}
