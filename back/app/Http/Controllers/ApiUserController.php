<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class ApiUserController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }

    public function create()
    {
        $item = User::create($request->all());
        return response()->json($item);
    }

    public function store(Request $request)
    {
        $item = User::create($request->all());
        return response()->json($item);
    }

    public function show($id)
    {
        $user = User::find($id);
        if($user){
            return response()->json($user);
        }else{
            return response()->json(["status" => "error"]);
        }
    }

    public function edit($id)
    {
    }

    public function update(Request $request, $id)
    {
        $userid = User::find($id);
        if($userid){
            $userid->update(
                [
                    'name'=> $request->name,
                    'email'=> $request->email,
                    'password'=> $request->password,
        ]);
            return response()->json($userid);
        }else{
            return response()->json(['id non trouvé']);
        }
    }

    public function destroy($id)
    {
    }
}
