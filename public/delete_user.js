function deleteUser(id){
	$.ajax({
		url: '/admin_crud_users/' + id,
		type: 'DELETE',
		sucess: function(resutls){
			window.location.reload(true);
		}
	})
}