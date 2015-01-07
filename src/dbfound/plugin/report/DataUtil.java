package dbfound.plugin.report;

import java.text.SimpleDateFormat;
import java.util.Date;


public class DataUtil{
	
	@SuppressWarnings("deprecation")
	public static String getData(int value){
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date data = new Date();
		data.setDate(data.getDate()+value);
		return format.format(data);
	}
}
