<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(Question::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $item = Question::create($request->all());
        return response()->json($item);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $item = Question::create($request->all());
        return response()->json($item);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $questionid = Question::find($id);
        if($questionid){
            $questionid->update(
                [
                    'categorie'=> $request->categorie,
                    'question'=> $request->question,
                    'reponse1'=> $request->reponse1,
                    'reponse2'=> $request->reponse2,
                    'reponse3'=> $request->reponse3,
                    'reponse4'=> $request->reponse4,
                    'reponse5'=> $request->reponse5,
                    'reponse6'=> $request->reponse6,
                    'reponse7'=> $request->reponse7,
                    'reponse8'=> $request->reponse8,
                    'reponse9'=> $request->reponse9,
                    'reponse10'=> $request->reponse10,

        ]);
            return response()->json($questionid);
        }else{
            return response()->json(['id non trouvé']);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $question = Question::find($id);
        if($question){
            $question->delete();
            return response()->json(["status" => "success"]);
        }else{
            return response()->json(["status" => "error"]);
        }
    }
}
