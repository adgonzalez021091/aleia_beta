from django import forms

class CVform(forms.Form):
    file = forms.FileField(label = "",)


class ServiceFormAp(forms.Form):
	id_vac_ap = forms.CharField(max_length=100,)
	tipo_serv_ap = forms.CharField(max_length=100,)
	tipo_etiq_ap = forms.CharField(max_length=100,)
	id_etiq_ap = forms.CharField(max_length=100,)
	id_vac_ap.widget = forms.HiddenInput(attrs={'id':'id_vac_serv_ap'})
	tipo_serv_ap.widget = forms.HiddenInput(attrs={'id':'tipo_serv_ap'})
	tipo_etiq_ap.widget = forms.HiddenInput(attrs={'id':'tipo_etiq_ap'})
	id_etiq_ap.widget = forms.HiddenInput(attrs={'id':'id_etiq_ap'})
	file_ap = forms.FileField(label = "",)

class ServiceFormRe(forms.Form):
	id_vac_re = forms.CharField(max_length=100,)
	tipo_serv_re = forms.CharField(max_length=100,)
	tipo_etiq_re = forms.CharField(max_length=100,)
	id_etiq_re = forms.CharField(max_length=100,)
	id_vac_re.widget = forms.HiddenInput(attrs={'id':'id_vac_serv_re'})
	tipo_serv_re.widget = forms.HiddenInput(attrs={'id':'tipo_serv_re'})
	tipo_etiq_re.widget = forms.HiddenInput(attrs={'id':'tipo_etiq_re'})
	id_etiq_re.widget = forms.HiddenInput(attrs={'id':'id_etiq_re'})
	file_re = forms.FileField(label = "",)