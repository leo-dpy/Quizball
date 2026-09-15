@extends('base')

@section('content')
<h1>Ajouter une question</h1>
<form method="POST" action="{{route('storequestion')}}" class="form-select">
    @csrf
    <div class="form-group">
        <label for="">Catégorie</label>
        <select name="categorie" id="">
            @foreach($categories as $categorie)
                <option value="{{$categorie->categorie}}">{{$categorie->categorie}}</option>
            @endforeach
        </select>
    </div>
    <div class="form-group">
    <label for="question">Question</label>
    <input type="text" class="form-control" name="question" id="question">
    </div>
    <div class="form-group">
    <label for="reponse1">Réponse 1 (bonne réponse)</label>
    <input type="text" class="form-control" name="reponse1" id="reponse1">
</div>
<div class="form-group">
    <label for="reponse2">Réponse 2</label>
    <input type="text" class="form-control" name="reponse2" id="reponse2">
</div>
<div class="form-group">
    <label for="reponse3">Réponse 3</label>
    <input type="text" class="form-control" name="reponse3" id="reponse3">
</div>
<div class="form-group">
    <label for="reponse4">Réponse 4</label>
    <input type="text" class="form-control" name="reponse4" id="reponse4">
</div>
<div class="form-group">
    <label for="reponse5">Réponse 5</label>
    <input type="text" class="form-control" name="reponse5" id="reponse5">
</div>
<div class="form-group">
    <label for="reponse6">Réponse 6</label>
    <input type="text" class="form-control" name="reponse6" id="reponse6">
</div>
<div class="form-group">
    <label for="reponse7">Réponse 7</label>
    <input type="text" class="form-control" name="reponse7" id="reponse7">
</div>
<div class="form-group">
    <label for="reponse8">Réponse 8</label>
    <input type="text" class="form-control" name="reponse8" id="reponse8">
</div>
<div class="form-group">
    <label for="reponse9">Réponse 9</label>
    <input type="text" class="form-control" name="reponse9" id="reponse9">
</div>
<div class="form-group">
    <label for="reponse10">Réponse 10</label>
    <input type="text" class="form-control" name="reponse10" id="reponse10">
</div>
<div class="form-group">
    <button type="submit" class="btn btn-primary">Ajouter</button>
</div>
</form>