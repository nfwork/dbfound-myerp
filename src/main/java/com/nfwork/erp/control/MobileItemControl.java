package com.nfwork.erp.control;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.dto.ResponseObject;
import com.nfwork.dbfound.model.ModelEngine;
import com.nfwork.dbfound.util.DataUtil;
import com.nfwork.dbfound.web.base.BaseControl;

public class MobileItemControl implements BaseControl {

	public ResponseObject saveBatch(Context context) throws Exception {
		ResponseObject object = new ResponseObject();
		
		String period_id = context.getString("param.period_id");
		if (DataUtil.isNull(period_id)) {
			object.setMessage("会计期间不能为空！");
			object.setSuccess(false);
			return object;
		}
		
		String exp_time = context.getString("param.exp_time");
		if (DataUtil.isNull(exp_time)) {
			object.setMessage("费用日期不能为空！");
			object.setSuccess(false);
			return object;
		}
		
		String description = context.getString("param.description");
		if (DataUtil.isNull(description)) {
			object.setMessage("凭证抬头不能为空！");
			object.setSuccess(false);
			return object;
		}
		
		List<Map<String, Object>> gridData = (List<Map<String, Object>>)context.getData("param.GridData");
		if (gridData==null || gridData.size()<1) {
			object.setMessage("凭证行不能为空！");
			object.setSuccess(false);
			return object;
		}
		
		//保存头
		ModelEngine.execute(context, "exp/item", "save");
		ModelEngine.batchExecute(context,"exp/itemLine", "save");
		
		object.setMessage("保存成功！");
		object.setSuccess(true);
		return object;
	}
	
	public ResponseObject save(Context context) throws Exception {
		ResponseObject object = new ResponseObject();
		
		String item_id = context.getString("param.item_id");

		String period_id = context.getString("param.period_id");
		if (DataUtil.isNull(period_id)) {
			object.setMessage("会计期间不能为空！");
			object.setSuccess(false);
			return object;
		}
		
		String exp_time = context.getString("param.exp_time");
		if (DataUtil.isNull(exp_time)) {
			object.setMessage("费用日期不能为空！");
			object.setSuccess(false);
			return object;
		}
		
		String dr_account_id = context.getString("param.dr_account_id");
		if (DataUtil.isNull(dr_account_id)) {
			object.setMessage("借方科目不能为空！");
			object.setSuccess(false);
			return object;
		}
		
		String cr_account_id = context.getString("param.cr_account_id");
		if (DataUtil.isNull(cr_account_id)) {
			object.setMessage("贷方科目不能为空！");
			object.setSuccess(false);
			return object;
		}
		
		String amount = context.getString("param.amount");
		if (DataUtil.isNull(amount)) {
			object.setMessage("金额不能为空！");
			object.setSuccess(false);
			return object;
		}
		
		String description = context.getString("param.description");
		if (DataUtil.isNull(description)) {
			object.setMessage("凭证抬头不能为空！");
			object.setSuccess(false);
			return object;
		}
		
		
		//保存头
		ModelEngine.execute(context, "exp/item", "save");
		
		//保存行
		if (DataUtil.isNull(item_id)) {
			List<Map<String, Object>> lineDatas = new ArrayList<Map<String, Object>>();
			Map<String, Object> dr = new HashMap<String, Object>();
			dr.put("dr_amount", amount);
			dr.put("account_id", dr_account_id);
			lineDatas.add(dr);
					
			Map<String, Object> cr = new HashMap<String, Object>();
			cr.put("cr_amount", amount);
			cr.put("account_id", cr_account_id);
			lineDatas.add(cr);
			
			context.setParamData("itemLine", lineDatas);
					
			ModelEngine.batchExecute(context, "exp/itemLine", "add" ,"param.itemLine");
			object.setMessage("保存成功！");
			object.setSuccess(true);
		}else {
			
		}

		return object;
	}

	public ResponseObject execute(Context context) throws Exception {
		return null;
	}

}
